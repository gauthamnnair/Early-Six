document.addEventListener('DOMContentLoaded', () => {
  function calculateBets(odd1, odd2, choice, inputAmount) {
    const maxOdd = Math.max(odd1, odd2);
    const minOdd = Math.min(odd1, odd2);
    let minAmount, maxAmount, loss;

    if (choice === '1') {
      minAmount = inputAmount;
      maxAmount = (minAmount * maxOdd) / minOdd;
      loss = minAmount + maxAmount - Math.min(minAmount * maxOdd, maxAmount * minOdd);

      return {
        minAmount,
        maxAmount,
        loss,
        minOdd,
        maxOdd,
        profitMin: minAmount * (maxOdd - 1),
        profitMax: maxAmount * (minOdd - 1)
      };
    } else if (choice === '2') {
      maxAmount = inputAmount;
      minAmount = (maxAmount * minOdd) / maxOdd;
      loss = minAmount + maxAmount - Math.min(minAmount * maxOdd, maxAmount * minOdd);

      return {
        minAmount,
        maxAmount,
        loss,
        minOdd,
        maxOdd,
        profitMin: minAmount * (maxOdd - 1),
        profitMax: maxAmount * (minOdd - 1)
      };
    } else if (choice === '3') {
      const targetLoss = inputAmount;
      const tolerance = 0.5;
      minAmount = 450;

      while (true) {
        maxAmount = (minAmount * maxOdd) / minOdd;
        loss = minAmount + maxAmount - Math.min(minAmount * maxOdd, maxAmount * minOdd);
        if (Math.abs(loss - targetLoss) <= tolerance) break;
        minAmount += 1;
      }

      return {
        minAmount,
        maxAmount,
        loss,
        minOdd,
        maxOdd,
        profitMin: minAmount * (maxOdd - 1),
        profitMax: maxAmount * (minOdd - 1)
      };
    } else if (choice === '4') {
      minAmount = 2000 / maxOdd;
      maxAmount = 2000 / minOdd;
      loss = minAmount + maxAmount - Math.min(minAmount * maxOdd, maxAmount * minOdd);

      return {
        minAmount,
        maxAmount,
        loss,
        minOdd,
        maxOdd,
        profitMin: minAmount * (maxOdd - 1),
        profitMax: maxAmount * (minOdd - 1)
      };
    }

    throw new Error('Invalid choice');
  }

  function formatNumber(num) {
    return Number(num).toFixed(2);
  }

function calculateSettlement(result, winType, cashout = 0) {
  let settlement = '';

  if (winType === 'maxOdd') {
    const originalLoss = result.profitMin - result.maxAmount;
    const netLoss = originalLoss + cashout;
    const lossPerPerson = netLoss / 2;
    settlement =
      `${result.maxOdd} Profit: ₹${formatNumber(result.profitMin)}<br>` +
      `${result.minOdd} Loss: ₹${formatNumber(result.maxAmount)}<br>` +
      `Loss before cashout: ₹${formatNumber(Math.abs(originalLoss))}<br>` +
      `Cashout: ₹${formatNumber(cashout)}<br>` +
      `Loss after cashout: ₹${formatNumber(Math.abs(netLoss))}<br>` +
      `Per Person: ₹${formatNumber(Math.abs(lossPerPerson))}<br>` +
      `${result.maxOdd} to ${result.minOdd} Transfer ₹${formatNumber(result.profitMin - lossPerPerson)}`;
  } else if (winType === 'minOdd') {
    const originalLoss = result.profitMax - result.minAmount;
    const netLoss = originalLoss + cashout;
    const lossPerPerson = netLoss / 2;
    settlement =
      `${result.minOdd} Profit: ₹${formatNumber(result.profitMax)}<br>` +
      `${result.maxOdd} Loss: ₹${formatNumber(result.minAmount)}<br>` +
      `Loss before cashout: ₹${formatNumber(Math.abs(originalLoss))}<br>` +
      `Cashout: ₹${formatNumber(cashout)}<br>` +
      `Loss after cashout: ₹${formatNumber(Math.abs(netLoss))}<br>` +
      `Per Person: ₹${formatNumber(Math.abs(lossPerPerson))}<br>` +
      `${result.minOdd} to ${result.maxOdd} Transfer ₹${formatNumber(result.profitMax - lossPerPerson)}`;
  } else if (winType === 'both') {
    const firstWinAmount = result.minAmount * result.maxOdd - result.minAmount;
    const secondWinAmount = result.maxAmount * result.minOdd - result.maxAmount;
    const totalProfit = firstWinAmount + secondWinAmount;
    const profitPerPerson = totalProfit / 2;

    settlement = `Profit on ${formatNumber(result.maxOdd)}: ₹${formatNumber(firstWinAmount)}<br>` +
      `Profit on ${formatNumber(result.minOdd)}: ₹${formatNumber(secondWinAmount)}<br>` +
      `Total Profit: ₹${formatNumber(totalProfit)}<br>` +
      `Per Person: ₹${formatNumber(profitPerPerson)}<br>`;

    let transfer;
    if (firstWinAmount > secondWinAmount) {
      transfer = firstWinAmount - profitPerPerson;
      settlement += `${result.maxOdd} to ${result.minOdd} Transfer ₹${formatNumber(Math.abs(transfer))}`;
    } else {
      transfer = secondWinAmount - profitPerPerson;
      settlement += `${result.minOdd} to ${result.maxOdd} Transfer ₹${formatNumber(Math.abs(transfer))}`;
    }
  }

  return settlement;
}

  document.querySelector('#app').innerHTML = `
    <div class="container">
      <h1>Early Six Calculater</h1>
      <div class="form-group">
        <label for="odd1">First Odd:</label>
        <input type="number" id="odd1" step="1" min="1" required>
      </div>
      <div class="form-group">
        <label for="odd2">Second Odd:</label>
        <input type="number" id="odd2" step="1" min="1" required>
      </div>
      <div class="form-group">
        <label for="choice">Calculation Type:</label>
        <select id="choice">
          <option value="1">Minimum Amount</option>
          <option value="2">Maximum Amount</option>
          <option value="3">Loss Amount</option>
          <option value="4">Max Offer</option>
        </select>
      </div>
      <div class="form-group" id="amountGroup">
        <label for="amount">Amount:</label>
        <input type="number" id="amount" step="1" min="0" required>
      </div>
      <button id="calculate">Calculate</button>

      <div id="result" class="result">
        <h3>Results:</h3>
        <p id="resultText"></p>
        <div class="settlement-buttons">
          <button id="maxOddWin"></button>
          <button id="minOddWin"></button>
          <button id="bothWin">Both Win</button>
        </div>
	<div id="cashoutGroup" class="form-group" style="display: none;">
              <label for="cashout" style="color: white;">Cashout Amount:</label>
              <input type="number" id="cashout" step="0.01" min="0" />
        </div>
        <p id="settlementText" class="settlement-text"></p>
        <button id="copySettlement">Copy Settlement</button>
      </div>
      <div id="error" class="error"></div>
    </div>
  `;

  let lastResult = null;

  document.getElementById('choice').addEventListener('change', (e) => {
    document.getElementById('amountGroup').style.display = e.target.value === '4' ? 'none' : 'block';
  });

  document.getElementById('calculate').addEventListener('click', () => {
    const odd1 = parseFloat(document.getElementById('odd1').value);
    const odd2 = parseFloat(document.getElementById('odd2').value);
    const choice = document.getElementById('choice').value;
    const amount = parseFloat(document.getElementById('amount').value);

    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const resultText = document.getElementById('resultText');

    try {
      if (isNaN(odd1) || isNaN(odd2) || odd1 < 1 || odd2 < 1 || (choice !== '4' && (isNaN(amount) || amount < 0))) {
        throw new Error('Please enter valid numbers. Odds must be > 1 and amount must be positive.');
      }

      const result = calculateBets(odd1, odd2, choice, amount);
      lastResult = result;

      resultText.innerHTML = `
        Put ₹${formatNumber(result.minAmount)} on odds ${formatNumber(result.maxOdd)}<br>
        Put ₹${formatNumber(result.maxAmount)} on odds ${formatNumber(result.minOdd)}<br>
        Maximum Loss: ₹${formatNumber(result.loss)}<br>
        Profit if first bet wins: ₹${formatNumber(result.profitMin)}<br>
        Profit if second bet wins: ₹${formatNumber(result.profitMax)}
      `;

      document.getElementById('maxOddWin').textContent = `Odds ${formatNumber(result.maxOdd)} Wins`;
      document.getElementById('minOddWin').textContent = `Odds ${formatNumber(result.minOdd)} Wins`;

      resultDiv.classList.add('visible');
      errorDiv.textContent = '';
      document.getElementById('settlementText').textContent = '';
    } catch (error) {
      errorDiv.textContent = error.message;
      resultDiv.classList.remove('visible');
    }
  });

const cashoutGroup = document.getElementById('cashoutGroup');
const cashoutInput = document.getElementById('cashout');

document.getElementById('maxOddWin').addEventListener('click', () => {
  if (lastResult) {
    cashoutGroup.style.display = 'block';
    cashoutInput.value = '';
    cashoutInput.oninput = () => {
      const cashout = parseFloat(cashoutInput.value) || 0;
      document.getElementById('settlementText').innerHTML = calculateSettlement(lastResult, 'maxOdd', cashout);
    };
    cashoutInput.oninput(); // Trigger on first open
  }
});

document.getElementById('minOddWin').addEventListener('click', () => {
  if (lastResult) {
    cashoutGroup.style.display = 'block';

    cashoutInput.value = '';
    cashoutInput.oninput = () => {
      const cashout = parseFloat(cashoutInput.value) || 0;
      document.getElementById('settlementText').innerHTML = calculateSettlement(lastResult, 'minOdd', cashout);
    };
    cashoutInput.oninput(); // Trigger on first open
  }
});

document.getElementById('bothWin').addEventListener('click', () => {
  if (lastResult) {
    cashoutGroup.style.display = 'none'; // Hide on both win
    document.getElementById('settlementText').innerHTML = calculateSettlement(lastResult, 'both');
  }
});
  document.getElementById('copySettlement').addEventListener('click', () => {
    const html = document.getElementById('settlementText').innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.innerText;

    navigator.clipboard.writeText(text).then(() => {
      alert('Settlement copied to clipboard!');
    }).catch(err => {
      alert('Failed to copy text: ' + err);
    });
  });
});
