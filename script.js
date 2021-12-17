let arr = [{nameShop: 'магазин', dateShop: 20, rubles: 250}];

let rowsContainer = document.querySelector('.rows-container');
let inpName = document.querySelector('.inp-name');
let inpPrice = document.querySelector('.inp-price');
let mainBut = document.querySelector('.main-button');
let total = document.querySelector('.total p span');

let countTotal = 0;

inpPrice.addEventListener('click', () => {
  inpPrice.value = '';
});
inpName.addEventListener('click', () => {
  inpName.value = '';
});

const turnOn = async () => {

  const resp = await fetch("http://localhost:8000/getAllTasks", {
    method: "GET",
  });
  const result = await resp.json();
  arr = result.data;

  while(rowsContainer.firstChild){
    rowsContainer.removeChild(rowsContainer.firstChild);
}

  arr.map((item, index) => {
 
    let row = document.createElement('div');
    row.id = `row-${index}`;
    row.className = 'row';
    rowsContainer.appendChild(row);


    let shop = document.createElement('div');
    let pShop = document.createElement('p');
    shop.className = 'shop';
    row.appendChild(shop);
    pShop.innerHTML = item.nameShop;
    shop.appendChild(pShop);

    let adaptiv = document.createElement('div');
    adaptiv.className = 'adaptiv';
    row.appendChild(adaptiv);

    let dateAmount = document.createElement('div');
    dateAmount.className = 'date';
    dateAmount.innerHTML = item.dateShop;
    adaptiv.appendChild(dateAmount);

    let amount = document.createElement('div');
    let pAmount = document.createElement('p');
    amount.className = 'amount';
    adaptiv.appendChild(amount);
    pAmount.innerHTML = item.rubles + 'p.';
    amount.appendChild(pAmount);

    let miniButs = document.createElement('div');
    miniButs.className = 'mini-buttons';
    adaptiv.appendChild(miniButs);

    let butReduct = document.createElement('div');
    butReduct.className = 'but-red';
    butReduct.addEventListener('click', () => redact(item, index, pShop, pAmount, butReduct, shop, amount, miniButs));
    miniButs.appendChild(butReduct);
    let img = document.createElement('img');
    img.src = 'img/icons8-поддержка-48.png';
    butReduct.appendChild(img);

    let butDelete = document.createElement('div');
    butDelete.className = 'but-del';
    butDelete.addEventListener('click', () => deleteOne(item, index, row));
    miniButs.appendChild(butDelete);
    let img2 = document.createElement('img');
    img2.src = 'img/icons8-удалить-48.png';
    butDelete.appendChild(img2);

    
  });

  countTotal = 0;
  arr.forEach(item => {
    countTotal += +item.rubles;
    total.innerHTML = countTotal;
  });
}


const dobav = async () => {
  let date = new Date();
  arr.push({nameShop: inpName.value, dateShop: `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`, rubles: inpPrice.value});

  const resp = await fetch("http://localhost:8000/createTask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      nameShop: inpName.value, 
      dateShop: `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`, 
      rubles: inpPrice.value,
      
    }),
  });
  const result = await resp.json();
  arr = result.data;

  turnOn();
  inpName.value = 'Куда было потрачено';
  inpPrice.value = 'Сколько было потрачено';
}
mainBut.addEventListener('click', dobav);

const redact = (item, index, pShop, pAmount, butReduct, shop, amount, miniButs) => {
  pShop.style = 'display:none';
  pAmount.style = 'display:none';
  butReduct.style = 'display:none';

  let emptyInpName = document.createElement('input');
  emptyInpName.className = 'empty-shopname-input';
  shop.appendChild(emptyInpName);

  let emptyInpPrice = document.createElement('input');
  emptyInpPrice.className = 'empty-shopprice-input';
  amount.appendChild(emptyInpPrice);

  console.log(item.nameShop);
  emptyInpName.value = item.nameShop;
  emptyInpPrice.value = item.rubles;

  let dobavIzm = document.createElement('div');
  dobavIzm.className = 'dobavIzm';
  miniButs.appendChild(dobavIzm);
  dobavIzm.addEventListener('click', () => AddIzm(item, index, pShop, pAmount, butReduct, shop, amount, miniButs, emptyInpName, emptyInpPrice));
}

const AddIzm = async (item, index, pShop, pAmount, butReduct, shop, amount, miniButs, emptyInpName, emptyInpPrice) => {
  console.log(pShop)
  pShop.style = 'display:block';
  pAmount.style = 'display:block';
  butReduct.style = 'display:flex';
  emptyInpPrice.style = 'display:none';
  emptyInpName.style = 'display:none';

  arr[index].nameShop = emptyInpName.value;
  arr[index].rubles = emptyInpPrice.value;

  const { _id, nameShop, rubles } = arr[index];
  const resp = await fetch("http://localhost:8000/updateTask", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      nameShop: nameShop,
      rubles: rubles,
      _id,
    }),
  });
  const result = await resp.json();
  arr = result.data;
  turnOn();
}

const deleteOne = async (item, index,) => {
  

  console.log(item._id);
  const resp = await fetch (`http://localhost:8000/deleteTask?_id=${item._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
    
    const result = await resp.json();
    arr = result.data;
    turnOn();
}

  


turnOn();