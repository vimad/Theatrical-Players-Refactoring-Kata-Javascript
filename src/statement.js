
function statement (invoice, plays) {
    const statementData = {}
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances;
    return renderPlainText(statementData, invoice, plays);
}

function renderPlainText(data, invoice, plays) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        result += ` ${getPlay(perf).name}: ${(usd(amountForPlay(perf)))} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${format(totalAmount() / 100)}\n`;
    result += `You earned ${(totalVolumeCredits())} credits\n`;
    return result;

    function format(number) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(number);
    }

    function getPlay(perf) {
        return plays[perf.playID];
    }

    function amountForPlay(perf) {
        let thisAmount = 0;
        switch (getPlay(perf).type) {
            case "tragedy":
                thisAmount = 40000;
                if (perf.audience > 30) {
                    thisAmount += 1000 * (perf.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = 30000;
                if (perf.audience > 20) {
                    thisAmount += 10000 + 500 * (perf.audience - 20);
                }
                thisAmount += 300 * perf.audience;
                break;
            default:
                throw new Error(`unknown type: ${getPlay(perf).type}`);
        }
        return thisAmount;
    }

    function volumeCreditForPerf(perf) {
        let volumeCredits = Math.max(perf.audience - 30, 0);
        if ("comedy" === getPlay(perf).type) volumeCredits += Math.floor(perf.audience / 5);
        return volumeCredits;
    }

    function usd(number) {
        return format(number / 100);
    }

    function totalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += volumeCreditForPerf(perf);
        }
        return volumeCredits;
    }

    function totalAmount() {
        let totalAmount = 0;
        for (let perf of data.performances) {
            totalAmount += amountForPlay(perf);
        }
        return totalAmount;
    }
}

module.exports = statement;
