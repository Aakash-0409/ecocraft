// Static product data for offline demo (real examples)
const PRODUCTS = [
  { id:'p1', name:'Flower Pot', material:'Plastic', basePrice:150, duration:3, desc:'Upcycled plastic planter' },
  { id:'p2', name:'Keychain', material:'Iron Scrap', basePrice:100, duration:2, desc:'Metal keychain from scrap' },
  { id:'p3', name:'Lamp', material:'Coconut Shell', basePrice:250, duration:4, desc:'Coconut shell lamp with LED' },
  { id:'p4', name:'Gift Box', material:'Paper', basePrice:200, duration:3, desc:'Handmade gift box from recycled paper' },
  { id:'p5', name:'Coaster Set', material:'Wood', basePrice:180, duration:2, desc:'Coasters from reclaimed wood' },
  { id:'p6', name:'Glass Planter', material:'Glass', basePrice:220, duration:3, desc:'Planter from recycled glass' }
];

// populate products
const productsList = document.getElementById('productsList');
PRODUCTS.forEach(p=>{
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `<h4>${p.name}</h4><p class="small">${p.desc}</p><div class="price">₹${p.basePrice}</div><div class="small">Making duration<br>${p.duration} days</div><div style="margin-top:10px"><button data-id="${p.id}" class="orderBtn">Order</button></div>`;
  productsList.appendChild(el);
});

// fill material/product selects
const materials = Array.from(new Set(PRODUCTS.map(p=>p.material)));
const matSelect = document.getElementById('custMaterial');
const prodSelect = document.getElementById('custProduct');
materials.forEach(m=>{
  const o = document.createElement('option'); o.value = m; o.textContent = m; matSelect.appendChild(o);
});
function populateProductsFor(mat){
  prodSelect.innerHTML = '<option value="">Select product</option>';
  PRODUCTS.filter(p=>p.material===mat).forEach(p=>{
    const o = document.createElement('option'); o.value = p.id; o.textContent = `${p.name} — ₹${p.basePrice}`; prodSelect.appendChild(o);
  });
}
matSelect.addEventListener('change', e=> populateProductsFor(e.target.value));

// order buttons on product cards
document.addEventListener('click', e=>{
  if(e.target.matches('.orderBtn')){
    const id = e.target.getAttribute('data-id');
    const product = PRODUCTS.find(p=>p.id===id);
    // prefill form
    document.getElementById('custProduct').innerHTML = `<option value="${product.id}">${product.name} — ₹${product.basePrice}</option>`;
    document.getElementById('custMaterial').value = product.material;
    document.getElementById('custQty').value = 1;
    window.location.hash = '#custom';
    window.scrollTo({top:0,behavior:'smooth'});
  }
});

// Save order locally (demo)
document.getElementById('saveOrder').addEventListener('click', ()=>{
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  const material = document.getElementById('custMaterial').value;
  const productId = document.getElementById('custProduct').value;
  const qty = document.getElementById('custQty').value;
  const notes = document.getElementById('custNotes').value.trim();
  if(!name || !material || !productId){ document.getElementById('orderMsg').textContent = 'Please fill name, material and product.'; return; }
  const product = PRODUCTS.find(p=>p.id===productId) || { name: productId };
  const order = { id: 'LCL-'+Date.now(), name, phone, email, material, product:product.name, qty, notes, createdAt: new Date().toISOString() };
  const orders = JSON.parse(localStorage.getItem('ecocraft_orders')||'[]');
  orders.unshift(order);
  localStorage.setItem('ecocraft_orders', JSON.stringify(orders));
  document.getElementById('orderMsg').textContent = 'Order saved locally. (Demo)';
  setTimeout(()=>document.getElementById('orderMsg').textContent='',3000);
  // reset form lightly
  document.getElementById('custName').value=''; document.getElementById('custPhone').value=''; document.getElementById('custNotes').value='';
});

// contact via mailto
document.getElementById('mailto').addEventListener('click', ()=>{
  const subject = encodeURIComponent('EcoCraft Custom Order');
  const body = encodeURIComponent('Hello ReSource,%0D%0AI would like to order...\n');
  window.location.href = `mailto:resource.ecocraft@gmail.com?subject=${subject}&body=${body}`;
});
document.getElementById('contactMail').addEventListener('click', ()=>{
  window.location.href = 'mailto:resource.ecocraft@gmail.com?subject=Contact%20via%20EcoCraft';
});
