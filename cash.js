let price = 3.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const priceScreen = document.getElementById('price-screen');
priceScreen.textContent = `Total: $${price}`;

const drawerDiv = document.getElementById("cash-drawer-display");
const cash = document.getElementById('cash');
const changeDue = document.getElementById("change-due");
const purchaseBtn = document.getElementById('purchase-btn');

const showCid = () => {
  drawerDiv.innerHTML = "";
  const heading = document.createElement('p');
  heading.innerHTML = `<strong>Change in Drawer</strong>`;
  drawerDiv.appendChild(heading);

  cid.forEach(([denom, amount]) => {
    const slot = document.createElement('div');
    slot.className = 'cash-slot';
    slot.innerHTML = `<strong>${denom}</strong><br>$${amount.toFixed(2)}`;
    drawerDiv.appendChild(slot);
  });
};
showCid();

const currencyUnit = {
  "PENNY": 0.01,
  "NICKEL": 0.05,
  "DIME": 0.10,
  "QUARTER": 0.25,
  "ONE": 1.00,
  "FIVE": 5.00,
  "TEN": 10.00,
  "TWENTY": 20.00,
  "ONE HUNDRED": 100.00
};

const calculateChange = () => {
  const cashGiven = parseFloat(cash.value);

  if (cashGiven < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  if (cashGiven === price) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    cash.value = '';
    return;
  }

  let change = cashGiven - price;
  let changeArr = [];

  let workingCid = cid.map(([name, amount]) => [name, amount]);
  let totalInDrawer = cid.reduce((sum, [, amount]) => sum + amount, 0);
  totalInDrawer = Math.round(totalInDrawer * 100) / 100;

  workingCid.slice().reverse().forEach(([name, amount], i, arr) => {
    let unitValue = currencyUnit[name];
    let amountGiven = 0;

    while (change >= unitValue && amount > 0) {
      change -= unitValue;
      amount -= unitValue;
      amountGiven += unitValue;

      change = Math.round(change * 100) / 100;
    }

    if (Math.abs(amount) < 0.01) amount = 0; // Prevent -0.00
    arr[i][1] = amount;

    if (amountGiven > 0) {
      changeArr.push([name, amountGiven]);
    }
  });

  if (change > 0) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
  } else {
    let totalChangeGiven = changeArr.reduce((sum, [, amt]) => sum + amt, 0);
    totalChangeGiven = Math.round(totalChangeGiven * 100) / 100;

    if (totalChangeGiven === totalInDrawer) {
      changeDue.innerHTML = `Status: CLOSED<br>` +
        changeArr.map(([name, amt]) => `${name}: $${amt.toFixed(2)}`).join("<br>");
      cid = [];
    } else {
      changeDue.innerHTML = `Status: OPEN<br>` +
        changeArr.map(([name, amt]) => `${name}: $${amt.toFixed(2)}`).join("<br>");
      cid = workingCid;
    }

    cash.value = '';
    showCid();
  }
};

purchaseBtn.addEventListener('click', calculateChange);
