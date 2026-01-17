
function statement (invoice, plays) {
    const statementData = {}
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    return renderPlainText(statementData, plays);

    function enrichPerformance(performance) {
        const result = Object.assign({}, performance);
        result.play = getPlay(performance);
        return result;
    }

    function getPlay(perf) {
        return plays[perf.playID];
    }
}

function renderPlainText(data, plays) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${(usd(amountForPlay(perf)))} (${perf.audience} seats)\n`;
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

    function amountForPlay(perf) {
        let thisAmount = 0;
        switch (perf.play.type) {
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
                throw new Error(`unknown type: ${perf.play.type}`);
        }
        return thisAmount;
    }

    function volumeCreditForPerf(perf) {
        let volumeCredits = Math.max(perf.audience - 30, 0);
        if ("comedy" === perf.play.type) volumeCredits += Math.floor(perf.audience / 5);
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
