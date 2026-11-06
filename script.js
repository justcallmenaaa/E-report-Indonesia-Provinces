// Variabel global untuk menyimpan data dari API
let allProvinces = [];

async function loadProvinces() {
  const container = document.getElementById('province-container');

  try {
    console.log("1. Sedang Mengirim permintaan ke API...");
    const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/v2/provinces.json");

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    
    const { data } = await res.json();

    console.log("2. Data berhasil ditarik dari API:", data);

    
    allProvinces = data;

    
    provincesToDisplay(allProvinces);

  } catch (error) {
    console.error("3. Gagal Menarik data:", error);
    if (container) {
      container.innerHTML = "<p class='text-red-500 col-span-full text-center'>Gagal Memuat Data dari Server.</p>";
    }
  }
}


function provincesToDisplay(provinces) {
  const container = document.getElementById('province-container');
  const countElement = document.getElementById('province-count');

  if (!container) return;

  container.innerHTML = "";

  
  if (countElement) {
    countElement.textContent = provinces.length;
  }

  if (provinces.length === 0) {
    container.innerHTML = "<p class='text-slate-400 col-span-full text-center py-8'>Provinsi tidak ditemukan.</p>";
    return;
  }

  
  provinces.forEach(provinsi => {
    const card = document.createElement('div');
    card.className = "province-card bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700 shadow-xl hover:border-red-500/50 transition-all duration-300 cursor-pointer";

   
    card.innerHTML = `
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-xl font-bold text-white province-name">${provinsi.name}</h3>
        <span class="text-xs bg-red-500/10 text-red-400 font-mono px-2.5 py-1 rounded border border-red-500/20">ID: ${provinsi.id}</span>
      </div>
      <div class="space-y-2 text-slate-300 text-sm">
        <p><strong class="text-white">Ibu Kota:</strong> ${provinsi.capital}</p>
        <p><strong class="text-white">Populasi:</strong> ${Number(provinsi.population).toLocaleString('id-ID')} jiwa</p>
        <p><strong class="text-white">Luas Wilayah:</strong> ${provinsi.total_area} km²</p>
      </div>
      <p class="text-xs text-red-400 mt-4 font-semibold text-right">Klik untuk detail &rarr;</p>
    `;

    
    card.addEventListener('click', () => {
      openModal(provinsi);
    });

    container.appendChild(card);
  });
}


function openModal(provinsi) {
  const modal = document.getElementById('province-modal');
  const modalContent = document.getElementById('modal-content');

  if (!modal || !modalContent) return;

  modalContent.innerHTML = `
    <span class="text-xs bg-red-500/20 text-red-400 font-mono px-3 py-1 rounded-full border border-red-500/30">ID Wilayah: ${provinsi.id}</span>
    <h2 class="text-3xl font-bold text-white mt-3 mb-6 border-b border-slate-700 pb-3">${provinsi.name}</h2>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300 text-sm mb-6">
      <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
        <p class="text-slate-400 text-xs uppercase tracking-wider mb-1">Ibu Kota</p>
        <p class="text-white font-bold text-base">${provinsi.capital}</p>
      </div>
      <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
        <p class="text-slate-400 text-xs uppercase tracking-wider mb-1">Total Populasi</p>
        <p class="text-white font-bold text-base">${Number(provinsi.population).toLocaleString('id-ID')} jiwa</p>
      </div>
      <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
        <p class="text-slate-400 text-xs uppercase tracking-wider mb-1">Luas Wilayah</p>
        <p class="text-white font-bold text-base">${provinsi.total_area} km²</p>
      </div>
      <div class="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
        <p class="text-slate-400 text-xs uppercase tracking-wider mb-1">Koordinat</p>
        <p class="text-white font-mono text-xs mt-1">Lat: ${provinsi.lat}<br>Lng: ${provinsi.lng}</p>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
}


function closeModal() {
  const modal = document.getElementById('province-modal');
  if (modal) modal.classList.add('hidden');
}


document.addEventListener("DOMContentLoaded", () => {
  loadProvinces();

  
  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  const modal = document.getElementById('province-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'province-modal') closeModal();
    });
  }

  
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase().trim();
      const filteredData = allProvinces.filter(provinsi =>
        provinsi.name.toLowerCase().includes(keyword)
      );
      provincesToDisplay(filteredData);
    });
  }
});