function statement(invoice, plays) {
    const statementData = {}
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    statementData.totalAmount = totalAmount(statementData);
    return renderPlainText(statementData);

    function enrichPerformance(performance) {
        const result = Object.assign({}, performance);
        result.play = playFor(performance);
        result.amount = amountFor(result);
        result.volumeCredit = volumeCreditFor(result);
        return result;
    }

    function playFor(perf) {
        return plays[perf.playID];
    }

    function amountFor(perf) {
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

    function volumeCreditFor(perf) {
        let volumeCredits = Math.max(perf.audience - 30, 0);
        if ("comedy" === perf.play.type) volumeCredits += Math.floor(perf.audience / 5);
        return volumeCredits;
    }

    function totalVolumeCredits(data) {
        let volumeCredits = 0;
        for (let perf of data.performances) {
            volumeCredits += perf.volumeCredit;
        }
        return volumeCredits;
    }

    function totalAmount(data) {
        let totalAmount = 0;
        for (let perf of data.performances) {
            totalAmount += perf.amount;
        }
        return totalAmount;
    }
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;
    for (let perf of data.performances) {
        result += ` ${perf.play.name}: ${(usd(perf.amount))} (${perf.audience} seats)\n`;
    }
    result += `Amount owed is ${format(data.totalAmount / 100)}\n`;
    result += `You earned ${(data.totalVolumeCredits)} credits\n`;
    return result;

    function format(number) {
        return new Intl.NumberFormat("en-US",
            {
                style: "currency", currency: "USD",
                minimumFractionDigits: 2
            }).format(number);
    }


    function usd(number) {
        return format(number / 100);
    }
}

module.exports = statement;
