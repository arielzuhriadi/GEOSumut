const osm = L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
)
const satelite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
)
const topo = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
)
const esri = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
)

const provinsi = L.layerGroup()
const kabupaten = L.layerGroup()
const kecamatan = L.layerGroup()
const desa = L.layerGroup()
const jalan = L.layerGroup()
const administrasi = L.layerGroup()
const landSurfaceTemperature = L.layerGroup()
const tutupanLahan = L.layerGroup()
const kemiringanLereng = L.layerGroup()
const panelSurya = L.layerGroup()
const sungai = L.layerGroup()

const map = L.map("map", {
    center: [2.1924, 99.0510],
    zoom: 7,
    layers: osm
})


const baseMaps = {
    "osm": osm,
    "satelite": satelite,
    "topo": topo,
    "esri": esri
}

const overlayLayer = {
    "Batas Provinsi": provinsi,
    "Batas Kabupaten": kabupaten,
    "Batas Kecamatan": kecamatan,
    "Batas Desa": desa,
    "Jalan": jalan,
    "Sungai": sungai,
    "Land Surface Temperature": landSurfaceTemperature,
    "Peta Admnistrasi": administrasi,
    "Tutupan Lahan": tutupanLahan,
    "Kemiringan Lereng": kemiringanLereng,
    "Potensi Panel Surya": panelSurya
}

// L.control.layers(baseMaps, overlayLayer).addTo(map)

// Menyimpan basemap yang sedang aktif
let activeBasemap = osm;

document.querySelectorAll('input[name="basemap"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
        const selectedBasemap = baseMaps[this.value];

        if (!selectedBasemap) return;

        if (map.hasLayer(activeBasemap)) {
            map.removeLayer(activeBasemap);
        }

        selectedBasemap.addTo(map);

        activeBasemap = selectedBasemap;
    });
});


// batas provinsi
async function batasProvinsi() {
    const res = await fetch("data_geojson/batas_provinsi.geojson")
    const data = await res.json()

    const legend = document.getElementById("infLegend");


    L.geoJSON(data, {
        style: function () {
            return{
                color: "#B22222",
                fillColor: "#B22222"
            }
        }, 
        onEachFeature: function (features, layer) {
            
        layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Batas Provinsi</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Negara</span>
                        <span class="popup-value">
                            ${features.properties.country ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Provinsi</span>
                        <span class="popup-value">
                            ${features.properties.province ?? "Tidak tersedia"}
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Batas Provinsi
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });

        }
    }).addTo(provinsi)
     
    legend.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-top: 10px; font-size: 14px; color: #E5E7EB;">
            <span style="display: inline-block;width: 28px; height: 4px; background-color: #B22222; border-radius: 2px; flex-shrink: 0;"></span>
            <span>Batas Provinsi Sumatera Utara</span>
        </div>
    `;
}
batasProvinsi()

// batas kabupaten
async function batasKabupaten() {
    const res   = await fetch("data_geojson/batas_kabupaten.geojson")
    const data  = await res.json()

    const colors = ["#ff0d00", "#FF9500", "#FFD60A", "#34C759", "#00E5A8", "#00C7FF", "#0A84FF", "#5E5CE6", "#BF5AF2", "#FF2D92"];

    let index = 0

    const featureColors = data.features.map((feature, i) => ({
        name: feature.properties.regency || `Kabupaten ${i + 1}`,
        color: colors[i % colors.length]
    }));

    L.geoJSON(data, {
        style: function(feature){
              const i = data.features.indexOf(feature);
            return{
                color: "#222222",
                weight: 1,
                fillColor: colors[index++ % colors.length],
                fillOpacity: 0.5
            }
        }, 
        onEachFeature: function (features, layer) {
        layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Batas Kabupaten</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Provinsi</span>
                        <span class="popup-value">
                            ${features.properties.province ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Kabupaten</span>
                        <span class="popup-value">
                            ${features.properties.regency ?? "Tidak tersedia"}
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Batas Kabupaten
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });

        }
    }).addTo(kabupaten)

    
    const legend = document.getElementById("legendKabupaten");

    legend.innerHTML = featureColors.map(item => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #E5E7EB;">
            <span style="width: 14px; height: 14px; background: ${item.color}; border: 1px solid #64748B; border-radius: 3px; flex-shrink: 0;"></span>
            <span>${item.name}</span>
        </div>
    `).join("");

}
function toggleLegendKabupaten() {
    const legend = document.getElementById("legendKabupaten");
    const icon = document.getElementById("iconLegendKabupaten");

    if (legend.style.display === "none") {
        legend.style.display = "block";
        icon.textContent = "−";
    } else {
        legend.style.display = "none";
        icon.textContent = "＋";
    }
}
batasKabupaten()


// batas kecamatan
async function batasKecamatan() {
    const res   = await fetch("data_geojson/batas_kecamatan.geojson")
    const data  = await res.json()

    const colors = ["#00BBF9", "#00F5D4", "#FEE440", "#7B2CBF", "#FB8500", "#90BE6D", "#577590", "#F94144", "#43AA8B"];

     const featureColors = data.features.map((feature, i) => ({
        name: feature.properties.district || `Kecamatan ${i + 1}`,
        regency: feature.properties.regency || "",
        color: colors[i % colors.length]
    }));

    L.geoJSON(data, {
        style: function(feature){
             const i = data.features.indexOf(feature);
            return{
                color: "#222222",
                weight: 1,
                fillColor: colors[i % colors.length],
                fillOpacity: 0.5
            }
        }, 
        onEachFeature: function (features, layer) {
        layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Batas Kecamatan</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Kabupaten</span>
                        <span class="popup-value">
                            ${features.properties.regency ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Kecamatan</span>
                        <span class="popup-value">
                            ${features.properties.district ?? "Tidak tersedia"}
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Batas Kecamatan
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });
        }
    }).addTo(kecamatan)

     const legend = document.getElementById("legendKecamatan");

    legend.innerHTML = featureColors.map(item => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #E5E7EB;">
            <span style="width: 14px; height: 14px; background: ${item.color}; border: 1px solid #64748B; border-radius: 3px; flex-shrink: 0;"></span>
            <span>
                ${item.name}
                ${item.regency ? `(${item.regency})` : ""}
            </span>
        </div>
    `).join("");
}
function toggleLegendKecamatan() {
    const legend = document.getElementById("legendKecamatan");
    const icon = document.getElementById("iconLegendKecamatan");

    if (legend.style.display === "none") {
        legend.style.display = "block";
        icon.textContent = "−";
    } else {
        legend.style.display = "none";
        icon.textContent = "＋";
    }
}
batasKecamatan()

// bats desa
async function batasDesa() {
    const res   = await fetch("data_geojson/batas_desa.geojson")
    const data  = await res.json()

    const colors = ["#00BBF9", "#00F5D4", "#FEE440", "#7B2CBF", "#FB8500", "#90BE6D", "#577590", "#F94144", "#43AA8B"];

     const featureColors = data.features.map((feature, i) => ({
        regency: feature.properties.regency || "",
        district: feature.properties.district || "",
        village: feature.properties.village || `Desa ${i + 1}`,
        color: colors[i % colors.length]
    }));

    L.geoJSON(data, {
        style: function(feature){
              const i = data.features.indexOf(feature);

            return{
                color: "#222222",
                weight: 1,
                fillColor: colors[i % colors.length],
                fillOpacity: 0.5
            }
        }, 
        onEachFeature: function (features, layer) {
        layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Batas Desa</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Kabupaten</span>
                        <span class="popup-value">
                            ${features.properties.regency ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Kecamatan</span>
                        <span class="popup-value">
                            ${features.properties.district ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Desa</span>
                        <span class="popup-value">
                            ${features.properties.village ?? "Tidak tersedia"}
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Batas Desa
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });
        }
    }).addTo(desa)
     const legend = document.getElementById("legendDesa");

    legend.innerHTML = featureColors.map(item => `
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 13px; color: #E5E7EB;">
            <span style="width: 14px; height: 14px; background: ${item.color}; border: 1px solid #64748B; border-radius: 3px; flex-shrink: 0; margin-top: 2px;"></span>
            <span>
                <strong>${item.village}</strong>
                <br>
                <span style="color: #9CA3AF; font-size: 11px;">
                    ${item.district}${item.regency ? `, ${item.regency}` : ""}
                </span>
            </span>
        </div>
    `).join("");
}
function toggleLegendDesa() {
    const legend = document.getElementById("legendDesa");
    const icon = document.getElementById("iconLegendDesa");

    if (legend.style.display === "none") {
        legend.style.display = "block";
        icon.textContent = "−";
    } else {
        legend.style.display = "none";
        icon.textContent = "＋";
    }
}
batasDesa()

// batas jalan
async function batasJalan() {
    const res = await fetch("data_geojson/jalan.geojson")
    const data = await res.json()

    L.geoJSON(data, {
        style: function () {
            return{
                color: "red",
                weight: 3
            }
        }, 
        onEachFeature: function (features, layer) {
        layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Batas Jalan</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Jalan</span>
                        <span class="popup-value">
                            ${features.properties.name ?? "Tidak tersedia"}
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Batas Jalan
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });
        }
    }).addTo(jalan)
}
batasJalan()

// data sungai
async function dataSungai() {
    const res = await fetch("data_geojson/sungai.geojson")
    const data = await res.json()

    L.geoJSON(data, {
        style: function () {
            return{

            }
        }, 
        onEachFeature: function (features, layer) {
             layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Aliran Sungai</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Sungai</span>
                        <span class="popup-value">
                            ${features.properties.name ?? "Tidak tersedia"}
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Aliran Sungai
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });
        }
    }).addTo(sungai)
}
dataSungai()

// land surface tempereture
async function dataLandSurface() {
    const res = await fetch("data_geojson/land_surface_temperature.geojson");
    const data = await res.json();

    function getWarna(suhu) {
        if (suhu >= 36) return "#d7191c";
        if (suhu >= 32) return "#fd8d3c";
        if (suhu >= 28) return "#ffd700";
        return "#2c7bb6";
    }

    L.geoJSON(data, {
        style: function (feature) {
             const suhu = Number(feature.properties.lst_celsius);
            return {
                color: "#333333",
                weight: 0.3,
                fillColor: getWarna(suhu),
                fillOpacity: 0.7
            };
        },
        onEachFeature: function (features, layer) {
        layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Land Surface Tempereture</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Suhu Permukaan</span>
                        <span class="popup-value">
                            ${features.properties.lst_celsius ?? "Tidak tersedia"} °C
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Kategori Suhu</span>
                        <span class="popup-value">
                            ${features.properties.kelas ?? "Tidak tersedia"}
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Land Surface Temperature
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });
        }
    }).addTo(landSurfaceTemperature);
    const legend = document.getElementById("legendLST");

    const kategoriSuhu = [
        {
            warna: "#d7191c",
            label: "≥ 36°C",
            keterangan: "Sangat panas"
        },
        {
            warna: "#fd8d3c",
            label: "32°C – < 36°C",
            keterangan: "Panas"
        },
        {
            warna: "#ffd700",
            label: "28°C – < 32°C",
            keterangan: "Hangat"
        },
        {
            warna: "#2c7bb6",
            label: "< 28°C",
            keterangan: "Lebih sejuk"
        }
    ];

    legend.innerHTML = `
        <div style="margin-bottom: 10px; color: #9CA3AF; font-size: 12px;">
            Suhu permukaan tanah dalam derajat Celsius (°C)
        </div>

        ${kategoriSuhu.map(item => `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 13px; color: #E5E7EB;">
                <span style="width: 16px; height: 16px; background: ${item.warna}; border: 1px solid #64748B; border-radius: 3px; flex-shrink: 0;"></span>
                <div>
                    <div style="font-weight: 600;">
                        ${item.label}
                    </div>

                    <div style="color: #9CA3AF; font-size: 11px; margin-top: 2px;">
                        ${item.keterangan}
                    </div>
                </div>
            </div>
        `).join("")}
    `;
}
function toggleLegendLST() {
    const legend = document.getElementById("legendLST");
    const icon = document.getElementById("iconLegendLST");

    if (legend.style.display === "none") {
        legend.style.display = "block";
        icon.textContent = "−";
    } else {
        legend.style.display = "none";
        icon.textContent = "＋";
    }
}
dataLandSurface()

// peta administrasi

async function batasPetaAdministrasi() {
    const res = await fetch("data_geojson/administrasi.geojson");
    const data = await res.json();

    const colors = [
        "#00BBF9",
        "#00F5D4",
        "#FEE440",
        "#7B2CBF",
        "#FB8500",
        "#90BE6D",
        "#577590",
        "#F94144",
        "#43AA8B"
    ];

    const featureColors = data.features.map((feature, i) => ({
        nama: feature.properties.nama || `Wilayah ${i + 1}`,
        jenis: feature.properties.jenis || "Tidak tersedia",
        ibukota: feature.properties.ibukota || "Tidak tersedia",
        color: colors[i % colors.length]
    }));

    L.geoJSON(data, {
        style: function (feature) {
            const i = data.features.indexOf(feature);

            return {
                color: "#424242",
                weight: 1,
                fillColor: colors[i % colors.length],
                fillOpacity: 3
            };
        },

        onEachFeature: function (features, layer) {
        layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Batas Administrasi</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Nama</span>
                        <span class="popup-value">
                            ${features.properties.nama ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Jenis</span>
                        <span class="popup-value">
                            ${features.properties.jenis ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Ibu Kota</span>
                        <span class="popup-value">
                            ${features.properties.ibukota ?? "Tidak tersedia"}
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Administrasi
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });
        }
    }).addTo(administrasi);

    const legend = document.getElementById("legendAdministrasi");

    legend.innerHTML = featureColors.map(item => `
        <div style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 13px; color: #E5E7EB;">
            <span style="width: 15px; height: 15px; background: ${item.color};border: 1px solid #64748B; border-radius: 3px; flex-shrink: 0; margin-top: 2px;"></span>

            <div>
                <div style="font-weight: 600;">
                    ${item.nama}
                </div>

                <div style="color: #9CA3AF; font-size: 11px; margin-top: 3px;">
                    Jenis: ${item.jenis}
                </div>

                <div style="color: #9CA3AF; font-size: 11px;margin-top: 2px;">
                    Ibu Kota: ${item.ibukota}
                </div>
            </div>
        </div>
    `).join("");
}

function toggleLegendAdministrasi() {
    const legend = document.getElementById("legendAdministrasi");
    const icon = document.getElementById("iconLegendAdministrasi");

    if (legend.style.display === "none") {
        legend.style.display = "block";
        icon.textContent = "−";
    } else {
        legend.style.display = "none";
        icon.textContent = "＋";
    }
}

batasPetaAdministrasi();


// peta tutupan lahan

async function batasTutupanLahan() {
    const res = await fetch("data_geojson/peta_tutupan_lahan.geojson");
    const data = await res.json();

    const warnaKelas = {
        "Hutan": "#1b7837",
        "Perkebunan Sawit": "#a6d96a",
        "Perkebunan Karet": "#66bd63",
        "Sawah": "#ffffbf",
        "Mangrove/Tambak": "#00cf75",
        "Pertanian Lahan Kering": "#f096ff",
        "Badan Air": "#2c7bb6",
        "Permukiman": "#d7191c"
    };

    L.geoJSON(data, {
        style: function (feature) {
            return {
                color: "#565656",
                weight: 0.5,
                fillColor: warnaKelas[feature.properties.kelas] || "#999999",
                fillOpacity: 0.7
            };
        },

        onEachFeature: function (features, layer) {
        layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Tutupan Lahan</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Jenis</span>
                        <span class="popup-value">
                            ${features.properties.kelas ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Luas km²</span>
                        <span class="popup-value">
                            ${features.properties.luas_km2 ?? "Tidak tersedia"} km²
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Tutupan Lahan
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });
        }
    }).addTo(tutupanLahan);

    const kelasUnik = [
        ...new Set(
            data.features.map(feature => feature.properties.kelas)
                .filter(Boolean)
        )
    ];

    const legend = document.getElementById("legendTutupanLahan");

    legend.innerHTML = kelasUnik.map(kelas => `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 13px; color: #E5E7EB;">
            <span style="width: 16px; height: 16px; background: ${warnaKelas[kelas] || "#999999"}; border: 1px solid #64748B; border-radius: 3px; flex-shrink: 0;"></span>

            <span>${kelas}</span>
        </div>
    `).join("");
}

function toggleLegendTutupanLahan() {
    const legend = document.getElementById("legendTutupanLahan");
    const icon = document.getElementById("iconLegendTutupanLahan");

    if (legend.style.display === "none") {
        legend.style.display = "block";
        icon.textContent = "−";
    } else {
        legend.style.display = "none";
        icon.textContent = "＋";
    }
}

batasTutupanLahan();

// kemiringan lereng
async function dataKemiringanLereng() {
    const res = await fetch("data_geojson/kemiringan_lereng.geojson")
    const data = await res.json()

     function getWarna(kelas) {
        if (kelas === "Datar (0-8%)") {
            return "#1a9641";        
        } else if (kelas === "Landai (8-15%)") {
            return "#a6d96a";       
        } else if (kelas === "Agak curam (15-25%)") {
            return "#ffffbf";        
        } else if (kelas === "Curam (25-45%)") {
            return "#fdae61";       
        } else if (kelas === "Sangat curam (>45%)") {
            return "#d7191c";        
        } else {
            return "#999999";        
        }
    }

    L.geoJSON(data, {
        style: function(features){
            return{
                color: "#494848",
                weight: 1,
                fillColor: getWarna(features.properties.kelas),
                fillOpacity: 0.6
            }
        }, 
        onEachFeature: function (features, layer) {
        layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Kemiringan Lereng</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> kategori</span>
                        <span class="popup-value">
                            ${features.properties.kelas ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Luas km²</span>
                        <span class="popup-value">
                            ${features.properties.luas_km2 ?? "Tidak tersedia"} km²
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Kemiringan Lereng
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });
        }
    }).addTo(kemiringanLereng)
    const kelasLereng = [
        {
            kelas: "Datar (0-8%)",
            warna: "#1a9641"
        },
        {
            kelas: "Landai (8-15%)",
            warna: "#a6d96a"
        },
        {
            kelas: "Agak curam (15-25%)",
            warna: "#ffffbf"
        },
        {
            kelas: "Curam (25-45%)",
            warna: "#fdae61"
        },
        {
            kelas: "Sangat curam (>45%)",
            warna: "#d7191c"
        }
    ];

    const legend = document.getElementById("legendLereng");

    legend.innerHTML = `
        <div style="margin-bottom: 12px; font-size: 12px; color: #9CA3AF;">
            Klasifikasi berdasarkan kemiringan lereng (%)
        </div>

        ${kelasLereng.map(item => `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; font-size: 13px; color: #E5E7EB;">
                <span style="width: 16px; height: 16px; background: ${item.warna}; border: 1px solid #64748B; border-radius: 3px; flex-shrink: 0;"></span>
                <span>${item.kelas}</span>
            </div>
        `).join("")}
    `;
}
dataKemiringanLereng()
function toggleLegendLereng() {
    const legend = document.getElementById("legendLereng");
    const icon = document.getElementById("iconLegendLereng");

    if (legend.style.display === "none") {
        legend.style.display = "block";
        icon.textContent = "−";
    } else {
        legend.style.display = "none";
        icon.textContent = "＋";
    }
}

// potensi panel surya
async function dataPotensiPanelSurya() {
    const res = await fetch("data_geojson/potensi_panel_surya.geojson")
    const data = await res.json()


    function getWarna(kelas) {
        if (kelas === "Sangat tinggi") {
            return "#d7191c";  
        } else if (kelas === "Tinggi") {
            return "#fdae61";   
        } else if (kelas === "Sedang") {
            return "#ffffbf";  
        } else if (kelas === "Rendah") {
            return "#2c7bb6";   
        } else {
            return "#999999";   
        }
    }

    L.geoJSON(data, {
        style: function(features){
            return{
                color: "#4f4f4f",
                weight: 1,
                fillColor: getWarna(features.properties.kelas),
                fillOpacity: 0.8
            }
        }, 
        onEachFeature: function (features, layer) {
            layer.bindPopup(`
            <div class="popup-provinsi">
                <div class="popup-header">
                     <div class="popup-icon"><img src="img/logo.png" width="100%" height="50vh"/></div>
                    <div class="popup-title">
                        <h3>Potensi Panel Surya</h3>
                        <span>INFORMASI GEOGRAFIS</span>
                    </div>
                </div>

                <div class="popup-content">
                    <div class="popup-item">
                        <span class="popup-label"> Potensi Energi</span>
                        <span class="popup-value">
                            ${features.properties.kelas ?? "Tidak tersedia"}
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Luas km²</span>
                        <span class="popup-value">
                            ${features.properties.luas_km2 ?? "Tidak tersedia"} km²
                        </span>
                    </div>

                    <div class="popup-item">
                        <span class="popup-label"> Estimasi Radiasi</span>
                        <span class="popup-value">
                            ${features.properties.ghi_rata2_kwh_m2_hari ?? "Tidak tersedia"} kWh
                        </span>
                    </div>
                </div>

                <div class="popup-footer">
                    <span class="status-dot"></span>
                    Data Kemiringan Lereng
                </div>
            </div>
        `, {
            maxWidth: 320,
            minWidth: 240,
            className: "popup-gis",
            closeButton: true
        });
        }
    }).addTo(panelSurya)
}

function toggleLegendPanelSurya() {
    const legend = document.getElementById("legendPanelSurya");
    const icon = document.getElementById("iconLegendPanelSurya");

    if (legend.style.display === "none") {
        legend.style.display = "block";
        icon.textContent = "−";
    } else {
        legend.style.display = "none";
        icon.textContent = "＋";
    }
}

dataPotensiPanelSurya()


// layer control
const overlayMap = {
    batsProvinsi: provinsi,
    batasKabupaten: kabupaten,
    batasKecamatan: kecamatan,
    batasDesa: desa,
    jalan: jalan,
    sungai: sungai,
    landSurfaceTempereture: landSurfaceTemperature,
    petaAdministrasi: administrasi,
    tutupanLahan: tutupanLahan,
    kemiringanLereng: kemiringanLereng,
    potensiPanelSurya: panelSurya
};

function toggleOverlay(nama) {
    const layer = overlayMap[nama];

    if (!layer) {
        console.warn("Layer belum tersedia:", nama);
        return;
    }

    if (map.hasLayer(layer)) {
        map.removeLayer(layer);
    } else {
        map.addLayer(layer);
    }
}

provinsi.addTo(map);