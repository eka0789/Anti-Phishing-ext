// Bisa digunakan jika mau munculin overlay langsung di halaman
const warning = document.createElement('div');
warning.innerText = '⚠️ Situs ini terindikasi phishing! Akses diblokir.';
warning.style = 'position:fixed;top:0;left:0;width:100%;background:red;color:white;text-align:center;font-weight:bold;z-index:9999;padding:10px;';
document.body.appendChild(warning);
