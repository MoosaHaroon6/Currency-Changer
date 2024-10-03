// CurrencyLayer API
const apiKey = '8773b98fc51ae924ec1c33556ca22344'; 
const liveAPIURL = `https://api.currencylayer.com/live?access_key=${apiKey}`;

const convertButton = document.querySelector('#convert-btn');

// Function to populate the currency dropdowns
function populateCurrencyDropdowns(currencies) {
    const fromCurrencyDropdown = document.getElementById('from-currency');
    const toCurrencyDropdown = document.getElementById('to-currency');

    for (let currency in currencies) {
        let optionFrom = document.createElement('option');
        let optionTo = document.createElement('option');

        optionFrom.value = currency;
        optionFrom.text = `${currency}`;
        optionTo.value = currency;
        optionTo.text = `${currency}`;

        fromCurrencyDropdown.appendChild(optionFrom);
        toCurrencyDropdown.appendChild(optionTo);
    }
}

// Fetch the list of available currencies (symbols)
fetch(liveAPIURL)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            populateCurrencyDropdowns(data.quotes);
        } else {
            convertButton.addEventListener('click', () => {
                convertButton.disable = true;
            })
        }
    })
    .catch(error => {
        console.error('Error fetching currency symbols:', error);
    });

// Event listener for the Convert button
document.getElementById('convert-btn').addEventListener('click', function () {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Fetch the exchange rates
    fetch(liveAPIURL)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Construct the currency pair for conversion
                const pair = `USD${toCurrency}`;
                const rate = data.quotes[pair];

                if (rate) {
                    const convertedAmount = amount * rate;
                    document.getElementById('result').innerHTML = `
                        ${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}
                    `;
                } else {
                    alert('Error fetching exchange rates.');
                }
            } else {
                alert('Error fetching exchange rates.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
});
