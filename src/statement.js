const createStatementData = require("./create-statement");

function statement(invoice, plays) {
    const statementData = createStatementData(invoice, plays);
    return renderPlainText(statementData);
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
