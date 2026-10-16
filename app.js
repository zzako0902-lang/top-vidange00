// ==========================================
// TOP-VIDANGE - APP.JS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // الجزء 1: التوقيت الحي
    // ==========================================
    const liveTimeElement =
        document.getElementById("live-time");
    if (liveTimeElement) {
        const updateLiveTime = () => {
            const now = new Date();
            const year =
                now.getFullYear();
            const month =
                String(now.getMonth() + 1).padStart(2, "0");
            const day =
                String(now.getDate()).padStart(2, "0");
            const hours =
                String(now.getHours()).padStart(2, "0");
            const minutes =
                String(now.getMinutes()).padStart(2, "0");
            liveTimeElement.textContent =
                `${year}-${month}-${day} ${hours}:${minutes}`;
        };
        updateLiveTime();
        setInterval(
            updateLiveTime,
            60000
        );
    }
    // ==========================================
    // الجزء 2: الاتصال بـ Google Apps Script
    // ==========================================
    const APPS_SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbz4qV9dMOMCVZLwYsiesjsls94PxlJrNQxdwTmZxfJ-r6L-LUHDA7gqEbwDxgqVyBxhjw/exec";
    // رقم الإدارة يبقى في sessionStorage حتى إغلاق تبويب الإدارة، ولا يُحفظ في الرابط إلا لطلب القائمة بسبب قيود CORS في Apps Script.
    const getAdminPin = () => {
        if (sessionStorage.getItem("topVidangeAdminVerified") !== "1") return "";
        return (sessionStorage.getItem("topVidangeAdminPin") || "").trim();
    };
    const createAccessToken = () => {
        const bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
    };
    // ==========================================
    // الجزء 3: عناصر النموذج
    // ==========================================
    const carBrandSelect =
        document.getElementById("car-brand");
    const carModelSelect =
        document.getElementById("car-model");
    const engineCapacitySelect =
        document.getElementById("engine-capacity");
    const prodYearInput =
        document.getElementById("prod-year");
    const currentKmInput =
        document.getElementById("current-km");
    const filterTypeSelect =
        document.getElementById("filter-type");
    const oilTypeSelect =
        document.getElementById("oil-type");
    const oilBrandSelect =
        document.getElementById("oil-brand");
    const nextVisitKmInput =
        document.getElementById("next-visit-km");
    const maintenanceDateInput =
        document.getElementById("maintenance-date");
                         if (maintenanceDateInput && !maintenanceDateInput.value) {
                         const today = new Date();
                         maintenanceDateInput.value =
                        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}
    const notesInput =
        document.getElementById("notes");
    // ==========================================
    // الجزء 4: البحث عن العلامة التجارية
    // ==========================================
    const carBrandSuggestions =
        document.getElementById(
            "car-brand-suggestions"
        );
    const carBrands = [
        "Toyota",
        "Mercedes-Benz",
        "BMW",
        "Audi",
        "Volkswagen",
        "Porsche",
        "Opel",
        "Smart",
        "Renault",
        "Peugeot",
        "Citroën",
        "DS Automobiles",
        "Alpine",
        "Fiat",
        "Alfa Romeo",
        "Lancia",
        "Maserati",
        "Ferrari",
        "Lamborghini",
        "Land Rover",
        "Range Rover",
        "Jaguar",
        "Bentley",
        "Rolls-Royce",
        "Aston Martin",
        "McLaren",
        "Lotus",
        "Mini",
        "Volvo",
        "Saab",
        "Polestar",
        "Koenigsegg",
        "Škoda",
        "SEAT",
        "CUPRA",
        "Dacia",
        "Ford",
        "Chevrolet",
        "Cadillac",
        "GMC",
        "Jeep",
        "Dodge",
        "Chrysler",
        "Lincoln",
        "Buick",
        "Tesla",
        "RAM",
        "Honda",
        "Nissan",
        "Mazda",
        "Mitsubishi",
        "Subaru",
        "Suzuki",
        "Lexus",
        "Infiniti",
        "Acura",
        "Isuzu",
        "Daihatsu",
        "Hyundai",
        "Kia",
        "Genesis",
        "Daewoo",
        "BYD",
        "Geely",
        "Chery",
        "Changan",
        "MG",
        "Haval",
        "Great Wall",
        "GWM",
        "Dongfeng",
        "JAC",
        "Jetour",
        "BAIC",
        "Foton",
        "FAW",
        "Exeed",
        "GAC",
        "Hongqi",
        "NIO",
        "XPeng",
        "Li Auto",
        "Tata",
        "Mahindra",
        "Maruti Suzuki",
        "Proton",
        "Perodua"
    ];
    let activeBrandIndex = -1;
    const showBrandSuggestions = (
        searchText = ""
    ) => {
        if (
            !carBrandSuggestions ||
            !carBrandSelect
        ) {
            return;
        }
        const query =
            searchText
                .trim()
                .toLowerCase();
        let filteredBrands;
        if (query === "") {
            filteredBrands =
                carBrands;
        } else {
            filteredBrands =
                carBrands.filter(
                    (brand) => {
                        return brand
                            .toLowerCase()
                            .includes(query);
                    }
                );
        }
        carBrandSuggestions.innerHTML = "";
        activeBrandIndex = -1;
        filteredBrands.forEach(
            (brand, index) => {
                const item =
                    document.createElement("div");
                item.className =
                    "car-brand-suggestion";
                item.textContent =
                    brand;
                item.dataset.index =
                    index;
                item.addEventListener(
                    "mousedown",
                    (event) => {
                        event.preventDefault();
                        carBrandSelect.value =
                            brand;
                        hideBrandSuggestions();
                        if (carModelSelect) {
                            carModelSelect.value = "";
                        }
                        hideModelSuggestions();
                        updateLivePreview();
                    }
                );
                carBrandSuggestions.appendChild(
                    item
                );
            }
        );
        if (
            filteredBrands.length > 0
        ) {
            carBrandSuggestions.style.display =
                "block";
        } else {
            carBrandSuggestions.style.display =
                "none";
        }
    };
    const hideBrandSuggestions = () => {
        if (carBrandSuggestions) {
            carBrandSuggestions.style.display =
                "none";
        }
        activeBrandIndex = -1;
    };
    const updateActiveBrand = () => {
        if (!carBrandSuggestions) {
            return;
        }
        const items =
            carBrandSuggestions.querySelectorAll(
                ".car-brand-suggestion"
            );
        items.forEach(
            (item, index) => {
                item.classList.toggle(
                    "active",
                    index === activeBrandIndex
                );
            }
        );
        if (
            activeBrandIndex >= 0 &&
            items[activeBrandIndex]
        ) {
            items[
                activeBrandIndex
            ].scrollIntoView({
                block: "nearest"
            });
        }
    };
    // ==========================================
    // الجزء 5: موديلات السيارات حسب العلامة
    // ==========================================
    const carModelSuggestions =
        document.getElementById(
            "car-model-suggestions"
        );
    const carModels = {
        "Toyota": [
            "Camry",
            "Corolla",
            "Yaris",
            "RAV4",
            "Land Cruiser",
            "Hilux",
            "C-HR",
            "Prius"
        ],
        "Mercedes-Benz": [
            "A-Class",
            "B-Class",
            "C-Class",
            "E-Class",
            "S-Class",
            "CLA",
            "GLA",
            "GLC",
            "GLE",
            "GLS",
            "Sprinter",
            "Vito"
        ],
        "BMW": [
            "1 Series",
            "2 Series",
            "3 Series",
            "4 Series",
            "5 Series",
            "7 Series",
            "X1",
            "X3",
            "X5",
            "X6"
        ],
        "Audi": [
            "A1",
            "A3",
            "A4",
            "A5",
            "A6",
            "A7",
            "A8",
            "Q3",
            "Q5",
            "Q7"
        ],
        "Volkswagen": [
            "Golf",
            "Polo",
            "Passat",
            "Tiguan",
            "Touareg",
            "Transporter"
        ],
        "Renault": [
            "Clio",
            "Megane",
            "Symbol",
            "Captur",
            "Kadjar",
            "Koleos"
        ],
        "Peugeot": [
            "208",
            "308",
            "508",
            "2008",
            "3008",
            "5008"
        ],
        "Fiat": [
            "500",
            "Panda",
            "Punto",
            "Tipo",
            "Doblo"
        ],
        "Ford": [
            "Fiesta",
            "Focus",
            "Mondeo",
            "Kuga",
            "Ranger",
            "Transit"
        ],
        "Nissan": [
            "Micra",
            "Qashqai",
            "Juke",
            "X-Trail",
            "Navara"
        ],
        "Hyundai": [
            "i10",
            "i20",
            "i30",
            "Elantra",
            "Tucson",
            "Santa Fe"
        ],
        "Kia": [
            "Picanto",
            "Rio",
            "Ceed",
            "Cerato",
            "Sportage",
            "Sorento"
        ]
    };
    let activeModelIndex = -1;
    const showModelSuggestions = (
        searchText = ""
    ) => {
        if (
            !carModelSuggestions ||
            !carModelSelect
        ) {
            return;
        }
        const selectedBrand =
            carBrandSelect
                ? carBrandSelect.value.trim()
                : "";
        const models =
            carModels[selectedBrand] || [];
        const query =
            searchText
                .trim()
                .toLowerCase();
        const filteredModels =
            models.filter(
                (model) => {
                    return model
                        .toLowerCase()
                        .includes(query);
                }
            );
        carModelSuggestions.innerHTML = "";
        activeModelIndex = -1;
        filteredModels.forEach(
            (model, index) => {
                const item =
                    document.createElement("div");
                item.className =
                    "car-brand-suggestion";
                item.textContent =
                    model;
                item.dataset.index =
                    index;
                item.addEventListener(
                    "mousedown",
                    (event) => {
                        event.preventDefault();
                        carModelSelect.value =
                            model;
                        hideModelSuggestions();
                        updateLivePreview();
                    }
                );
                carModelSuggestions.appendChild(
                    item
                );
            }
        );
        if (
            filteredModels.length > 0
        ) {
            carModelSuggestions.style.display =
                "block";
        } else {
            carModelSuggestions.style.display =
                "none";
        }
    };
    const hideModelSuggestions = () => {
        if (carModelSuggestions) {
            carModelSuggestions.style.display =
                "none";
        }
        activeModelIndex = -1;
    };
    // ==========================================
    // الجزء 6: أحداث البحث
    // ==========================================
    if (
        carBrandSelect &&
        carBrandSuggestions
    ) {
        carBrandSelect.addEventListener(
            "focus",
            () => {
                showBrandSuggestions(
                    carBrandSelect.value
                );
            }
        );
        carBrandSelect.addEventListener(
            "input",
            () => {
                if (carModelSelect) {
                    carModelSelect.value = "";
                }
                hideModelSuggestions();
                showBrandSuggestions(
                    carBrandSelect.value
                );
                updateLivePreview();
            }
        );
        carBrandSelect.addEventListener(
            "keydown",
            (event) => {
                const items =
                    carBrandSuggestions.querySelectorAll(
                        ".car-brand-suggestion"
                    );
                if (
                    event.key === "ArrowDown"
                ) {
                    event.preventDefault();
                    if (
                        items.length === 0
                    ) {
                        return;
                    }
                    activeBrandIndex =
                        Math.min(
                            activeBrandIndex + 1,
                            items.length - 1
                        );
                    updateActiveBrand();
                    return;
                }
                if (
                    event.key === "ArrowUp"
                ) {
                    event.preventDefault();
                    if (
                        items.length === 0
                    ) {
                        return;
                    }
                    activeBrandIndex =
                        Math.max(
                            activeBrandIndex - 1,
                            0
                        );
                    updateActiveBrand();
                    return;
                }
                if (
                    event.key === "Enter"
                ) {
                    if (
                        activeBrandIndex >= 0 &&
                        items[activeBrandIndex]
                    ) {
                        event.preventDefault();
                        carBrandSelect.value =
                            items[
                                activeBrandIndex
                            ].textContent;
                        if (carModelSelect) {
                            carModelSelect.value = "";
                        }
                        hideBrandSuggestions();
                        hideModelSuggestions();
                        updateLivePreview();
                    }
                    return;
                }
                if (
                    event.key === "Escape"
                ) {
                    hideBrandSuggestions();
                }
            }
        );
    }
    if (
        carModelSelect &&
        carModelSuggestions
    ) {
        carModelSelect.addEventListener(
            "focus",
            () => {
                showModelSuggestions(
                    carModelSelect.value
                );
            }
        );
        carModelSelect.addEventListener(
            "input",
            () => {
                showModelSuggestions(
                    carModelSelect.value
                );
                updateLivePreview();
            }
        );
        carModelSelect.addEventListener(
            "keydown",
            (event) => {
                const items =
                    carModelSuggestions.querySelectorAll(
                        ".car-brand-suggestion"
                    );
                if (
                    event.key === "ArrowDown"
                ) {
                    event.preventDefault();
                    if (
                        items.length === 0
                    ) {
                        return;
                    }
                    activeModelIndex =
                        Math.min(
                            activeModelIndex + 1,
                            items.length - 1
                        );
                    items.forEach(
                        (item, index) => {
                            item.classList.toggle(
                                "active",
                                index === activeModelIndex
                            );
                        }
                    );
                    return;
                }
                if (
                    event.key === "ArrowUp"
                ) {
                    event.preventDefault();
                    if (
                        items.length === 0
                    ) {
                        return;
                    }
                    activeModelIndex =
                        Math.max(
                            activeModelIndex - 1,
                            0
                        );
                    items.forEach(
                        (item, index) => {
                            item.classList.toggle(
                                "active",
                                index === activeModelIndex
                            );
                        }
                    );
                    return;
                }
                if (
                    event.key === "Enter"
                ) {
                    if (
                        activeModelIndex >= 0 &&
                        items[activeModelIndex]
                    ) {
                        event.preventDefault();
                        carModelSelect.value =
                            items[
                                activeModelIndex
                            ].textContent;
                        hideModelSuggestions();
                        updateLivePreview();
                    }
                    return;
                }
                if (
                    event.key === "Escape"
                ) {
                    hideModelSuggestions();
                }
            }
        );
    }
    document.addEventListener(
        "click",
        (event) => {
            if (
                carBrandSelect &&
                carBrandSuggestions &&
                !carBrandSelect.contains(
                    event.target
                ) &&
                !carBrandSuggestions.contains(
                    event.target
                )
            ) {
                hideBrandSuggestions();
            }
            if (
                carModelSelect &&
                carModelSuggestions &&
                !carModelSelect.contains(
                    event.target
                ) &&
                !carModelSuggestions.contains(
                    event.target
                )
            ) {
                hideModelSuggestions();
            }
        }
    );
    // ==========================================
    // الجزء 7: المعاينة الحية
    // ==========================================
    const summaryTitle =
        document.querySelector(
            ".car-badge-meta h4"
        );
    const summaryDetails =
        document.querySelector(
            ".car-badge-meta p"
        );
    const summaryNextKm =
        document.getElementById(
            "summary-next-km"
        );
    const updateLivePreview = () => {
        if (
            summaryTitle &&
            carBrandSelect &&
            carModelSelect
        ) {
            const brand =
                carBrandSelect.value.trim();
            const model =
                carModelSelect.value.trim();
            if (
                brand &&
                model
            ) {
                summaryTitle.textContent =
                    `${brand} ${model}`;
            } else if (brand) {
                summaryTitle.textContent =
                    brand;
            } else {
                summaryTitle.textContent =
                    "السيارة";
            }
        }
        if (
            summaryDetails &&
            prodYearInput &&
            engineCapacitySelect &&
            oilTypeSelect
        ) {
            summaryDetails.innerHTML =
                `${prodYearInput.value || "2020"}
                <span>|</span>
                ${engineCapacitySelect.value}
                <span>|</span>
                ${oilTypeSelect.value}`;
        }
        if (summaryNextKm) {
            const nextKm =
                nextVisitKmInput
                    ? nextVisitKmInput.value.trim()
                    : "";
            if (nextKm) {
                const numericKm =
                    Number(
                        nextKm.replace(
                            /,/g,
                            ""
                        )
                    );
                if (
                    !Number.isNaN(
                        numericKm
                    )
                ) {
                    summaryNextKm.textContent =
                        `الكيلومتراج القادم: ${numericKm.toLocaleString("fr-FR")} كم`;
                } else {
                    summaryNextKm.textContent =
                        `الكيلومتراج القادم: ${nextKm} كم`;
                }
            } else {
                summaryNextKm.textContent =
                    "الكيلومتراج القادم: —";
            }
        }
    };
    const inputElements = [
        carBrandSelect,
        carModelSelect,
        engineCapacitySelect,
        prodYearInput,
        currentKmInput,
        filterTypeSelect,
        oilTypeSelect,
        oilBrandSelect,
        nextVisitKmInput,
        maintenanceDateInput,
        notesInput
    ];
    inputElements.forEach(
        (element) => {
            if (element) {
                element.addEventListener(
                    "change",
                    updateLivePreview
                );
            }
        }
    );
    if (prodYearInput) {
        prodYearInput.addEventListener(
            "input",
            updateLivePreview
        );
    }
    if (currentKmInput) {
        currentKmInput.addEventListener(
            "input",
            updateLivePreview
        );
    }
    if (nextVisitKmInput) {
        nextVisitKmInput.addEventListener(
            "input",
            updateLivePreview
        );
    }
    if (notesInput) {
        notesInput.addEventListener(
            "input",
            updateLivePreview
        );
    }
    updateLivePreview();
    // ==========================================
    // الجزء 8: عناصر QR
    // ==========================================
    const generateQrButton =
        document.getElementById(
            "generate-qr-button"
        );
    const updateCarButton =
        document.getElementById(
            "update-car-button"
        );
    const realQrImg =
        document.getElementById(
            "real-qr-img"
        );
    const qrEmptyIcon =
        document.getElementById(
            "qr-empty-icon"
        );
    const successMessageBox =
        document.getElementById(
            "success-message-box"
        );
    const actionButtonsArea =
        document.getElementById(
            "action-buttons-area"
        );
    const readyBadge =
        document.getElementById(
            "ready-badge"
        );
    const carIdDisplay =
        document.getElementById(
            "car-id-display"
        );
    // ==========================================
    // الجزء 9: إنشاء معرّف السيارة
    // ==========================================
    const getNextCarId = () => {
        let nextNumber =
            parseInt(
                localStorage.getItem(
                    "topVidangeNextCarNumber"
                )
            ) || 1;
        const carId =
            "CAR-" +
            String(
                nextNumber
            ).padStart(
                4,
                "0"
            );
        localStorage.setItem(
            "topVidangeNextCarNumber",
            nextNumber + 1
        );
        return carId;
    };
    // ==========================================
    // الجزء 10: إرسال البيانات إلى Google
    // ==========================================
    const sendCarDataToGoogle = (
        carData
    ) => {
        const adminPin = getAdminPin();
        if (!adminPin) return Promise.resolve(false);
        return fetch(
            APPS_SCRIPT_URL,
            {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },
                body:
                    JSON.stringify({ ...carData, adminPin })
            }
        )
        .then(
            () => {
                console.log(
                    "تم إرسال بيانات السيارة إلى Google"
                );
                return true;
            }
        )
        .catch(
            (error) => {
                console.error(
                    "فشل إرسال البيانات إلى Google:",
                    error
                );
                return false;
            }
        );
    };
    // ==========================================
    // الجزء 11: إنشاء QR
    // ==========================================
    if (generateQrButton) {
        generateQrButton.addEventListener(
            "click",
            async () => {
                const carId =
                    getNextCarId();
                localStorage.setItem(
                    "topVidangeCurrentCarId",
                    carId
                );
                if (carIdDisplay) {
                    carIdDisplay.textContent =
                        `معرّف السيارة: ${carId}`;
                }
                const accessToken = createAccessToken();
                const customerUrl =
                    `https://zzako0902-lang.github.io/top-vidange00/customer.html?token=${encodeURIComponent(accessToken)}`;
                const qrApiUrl =
                    "https://api.qrserver.com/v1/create-qr-code/"
                    + "?size=200x200"
                    + "&data="
                    + encodeURIComponent(
                        customerUrl
                    );
                if (realQrImg) {
                    realQrImg.src =
                        qrApiUrl;
                    realQrImg.style.display =
                        "block";
                }
                if (qrEmptyIcon) {
                    qrEmptyIcon.style.display =
                        "none";
                }
                if (successMessageBox) {
                    successMessageBox.style.display =
                        "flex";
                }
                if (actionButtonsArea) {
                    actionButtonsArea.style.display =
                        "flex";
                }
                if (readyBadge) {
                    readyBadge.style.display =
                        "inline-block";
                }
                if (updateCarButton) {
                    updateCarButton.style.display =
                        "block";
                }
                const carData = {
                    id:
                        carId,
                    access_token:
                        accessToken,
                    brand:
                        carBrandSelect?.value || "",
                    model:
                        carModelSelect?.value || "",
                    year:
                        prodYearInput?.value || "",
                    engine:
                        engineCapacitySelect?.value || "",
                    oil:
                        oilTypeSelect?.value || "",
                    oil_brand:
                        oilBrandSelect?.value || "",
                    mileage:
                        currentKmInput?.value || "",
                    filters:
                        filterTypeSelect?.value || "",
                    next_service:
                        "",
                    next_km:
                        nextVisitKmInput?.value || "",
                    maintenance_date:
                        maintenanceDateInput?.value || "",
                    notes:
                        notesInput?.value || "",
                    createdAt:
                        new Date().toISOString()
                };
                localStorage.setItem(
                    `topVidange_${carId}`,
                    JSON.stringify(
                        carData
                    )
                );
                updateLivePreview();
                await sendCarDataToGoogle(
                    carData
                );
                console.log(
                    "السيارة:",
                    carData
                );
            }
        );
    }
// ==========================================
// الجزء 12: تحديث بيانات السيارة وتسجيل الصيانة
// ==========================================
if (updateCarButton) {
    updateCarButton.addEventListener("click", async () => {
        const currentCarId = localStorage.getItem(
            "topVidangeCurrentCarId"
        );
        if (!currentCarId || updateCarButton.disabled) {
            return;
        }
        // التأكد من وجود تاريخ الصيانة
        const maintenanceDate = maintenanceDateInput?.value || "";
        const mileage = currentKmInput?.value || "";
        if (!maintenanceDate || !mileage) {
            alert("يرجى إدخال تاريخ الصيانة والكيلومترات الحالية.");
            return;
        }
        updateCarButton.disabled = true;
        const originalButtonHTML = updateCarButton.innerHTML;
        updateCarButton.innerHTML = `
            <i class="fa-solid fa-rotate fa-spin"></i>
            جاري تسجيل الصيانة والتحديث...
        `;
        const adminPin = getAdminPin();
        if (!adminPin) { updateCarButton.disabled = false; return; }
        const savedCarData = JSON.parse(localStorage.getItem(`topVidange_${currentCarId}`) || "{}");
        const updatedCarData = {
            action: "updateCarAndRecordMaintenance",
            adminPin,
            access_token: savedCarData.access_token || "",
            id: currentCarId,
            brand: carBrandSelect?.value || "",
            model: carModelSelect?.value || "",
            year: prodYearInput?.value || "",
            engine: engineCapacitySelect?.value || "",
            oil: oilTypeSelect?.value || "",
            oil_brand: oilBrandSelect?.value || "",
            mileage: mileage,
            filters: filterTypeSelect?.value || "",
            next_service: "",
            next_km: nextVisitKmInput?.value || "",
            maintenance_date: maintenanceDate,
            notes: notesInput?.value || "",
            updatedAt: new Date().toISOString()
        };
        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(updatedCarData)
            });
            // في وضع no-cors لا يمكن قراءة استجابة Google
            // لذلك لا ندّعي أن الخادم أكد نجاح العملية.
            localStorage.setItem(
                `topVidange_${currentCarId}`,
                JSON.stringify(updatedCarData)
            );
            updateCarButton.innerHTML = `
                <i class="fa-solid fa-check"></i>
                تم إرسال طلب التحديث
            `;
            if (successMessageBox) {
                successMessageBox.style.display = "flex";
                const successTitle =
                    successMessageBox.querySelector(".success-text h4");
                const successDescription =
                    successMessageBox.querySelector(".success-text p");
                if (successTitle) {
                    successTitle.textContent = "تم إرسال طلب التحديث";
                }
                if (successDescription) {
                    successDescription.textContent =
                        "يرجى التحقق من Google Sheets للتأكد من تسجيل الصيانة.";
                }
            }
            updateLivePreview();
        } catch (error) {
            console.error("خطأ في إرسال بيانات الصيانة:", error);
            updateCarButton.innerHTML = originalButtonHTML;
            if (successMessageBox) {
                successMessageBox.style.display = "flex";
                const successTitle =
                    successMessageBox.querySelector(".success-text h4");
                const successDescription =
                    successMessageBox.querySelector(".success-text p");
                if (successTitle) {
                    successTitle.textContent = "تعذر إرسال الطلب";
                }
                if (successDescription) {
                    successDescription.textContent =
                        "تحقق من اتصال الإنترنت ثم حاول مجددًا.";
                }
            }
        } finally {
            setTimeout(() => {
                updateCarButton.disabled = false;
                updateCarButton.innerHTML = originalButtonHTML;
            }, 2000);
        }
    });
}
    // ==========================================
    // الجزء 13: طباعة QR
    // ==========================================
    const printButton =
        document.querySelector(
            ".btn-print"
        );
    if (printButton) {
        printButton.addEventListener(
            "click",
            () => {
                if (
                    !realQrImg ||
                    !realQrImg.src
                ) {
                    return;
                }
                const qrWindow =
                    window.open(
                        "",
                        "\_blank"
                    );
                if (!qrWindow) {
                    return;
                }
                qrWindow.document.write(`
                    <!DOCTYPE html>
                    <html lang="ar" dir="rtl">
                    <head>
                        <meta charset="UTF-8">
                        <title>
                            QR - TOP-VIDANGE
                        </title>
                    </head>
                    <body
                        style="
                            margin:0;
                            display:flex;
                            justify-content:center;
                            align-items:center;
                            min-height:100vh;
                        "
                    >
                        <img
                            src="${realQrImg.src}"
                            style="
                                width:300px;
                                height:300px;
                            "
                            alt="QR Code"
                        >
                        <script>
                            window.onload = function() {
                                window.print();
                            };
                        <\\/script>
                    </body>
                    </html>
                `);
                qrWindow.document.close();
            }
        );
    }
    // ==========================================
    // الجزء 14: تحميل QR
    // ==========================================
    const downloadButton =
        document.querySelector(
            ".btn-download"
        );
    if (downloadButton) {
        downloadButton.addEventListener(
            "click",
            () => {
                if (
                    !realQrImg ||
                    !realQrImg.src
                ) {
                    return;
                }
                const link =
                    document.createElement(
                        "a"
                    );
                link.href =
                    realQrImg.src;
                link.download =
                    "QR_TOP_VIDANGE.png";
                document.body.appendChild(
                    link
                );
                link.click();
                document.body.removeChild(
                    link
                );
            }
        );
    }
    // =========================================================
    // الجزء 15: واجهة بيانات السيارات والبحث وسجل الصيانة
    // =========================================================
    const recordsView = document.getElementById("car-records-view");
    if (recordsView) {
        const recordsHeading = recordsView.querySelector(".section-title");
        const recordsApiUrl = APPS_SCRIPT_URL;
        const recordsUi = document.createElement("div");
        recordsUi.id = "tv-functional-records";
        recordsUi.innerHTML = `
            <section class="tv-search-panel">
                <h2 class="tv-search-title">البحث عن سيارة</h2>
                <p class="tv-search-subtitle">أدخل رقم السيارة فقط</p>
                <div class="tv-search-row" dir="ltr">
                    <button id="tv-record-delete" class="tv-delete-button" type="button" title="حذف السيارة نهائيًا">
                        <i class="fa-solid fa-trash-can"></i><span>حذف السيارة</span>
                    </button>
                    <button id="tv-record-search-button" class="tv-search-button" type="button">
                        <i class="fa-solid fa-magnifying-glass"></i><span>بحث</span>
                    </button>
                    <div class="tv-search-input-wrap">
                        <i class="fa-solid fa-car tv-search-car-icon"></i>
                        <input id="tv-record-search" type="text" placeholder="0090" inputmode="numeric" autocomplete="off" aria-label="رقم السيارة فقط">
                    </div>
                </div>
                <p id="tv-record-status" role="status" aria-live="polite">أدخل ID السيارة ثم اضغط بحث لعرض بياناتها وسجل الصيانة.</p>
            </section>
            <div id="tv-record-results" style="display:none;margin-bottom:18px;"></div>
            <div id="tv-record-detail" style="display:none;">
                <section class="tv-detail-card">
                    <div class="tv-detail-heading"><span>معلومات السيارة</span><i class="fa-solid fa-car-side"></i></div>
                    <div class="tv-car-info-grid">
                        <div id="tv-detail-fields-left" class="tv-detail-fields"></div>
                        <div id="tv-detail-fields-right" class="tv-detail-fields"></div>
                        <div class="tv-qr-column">
                            <div class="tv-qr-frame"><img id="tv-detail-qr" alt="رمز QR للسيارة"></div>
                            <p id="tv-detail-qr-id"></p>
                            <button id="tv-open-customer-page" type="button">فتح صفحة السيارة</button>
                        </div>
                    </div>
                </section>
                <button id="tv-edit-car" type="button"><i class="fa-solid fa-rotate"></i><span>تحديث بيانات السيارة</span></button>
                <section class="tv-history-card">
                    <div class="tv-history-heading"><span><i class="fa-solid fa-clock-rotate-left"></i> سجل تغييرات الزيت</span><span id="tv-history-count"></span></div>
                    <div class="tv-history-scroll"><table class="tv-history-table">
                        <thead><tr><th>#</th><th>التاريخ</th><th>الكيلومتراج</th><th>نوع الزيت</th><th>العلامة التجارية</th><th>الفلاتر</th><th>ملاحظات</th></tr></thead>
                        <tbody id="tv-history-body"><tr><td colspan="7">ابحث عن سيارة لعرض سجلها.</td></tr></tbody>
                    </table></div>
                </section>
            </div>
            <div id="tv-record-list" style="display:none;margin-top:18px;"></div>
            <!-- الجزء 15.1: نافذة تأكيد حذف السيارة بتصميم الواجهة -->
            <div id="tv-delete-modal" class="tv-delete-modal" style="display:none;" role="presentation">
                <div class="tv-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="tv-delete-title" aria-describedby="tv-delete-message">
                    <div class="tv-delete-icon"><i class="fa-solid fa-trash-can"></i></div>
                    <h3 id="tv-delete-title">تأكيد حذف السيارة</h3>
                    <p id="tv-delete-message">هل أنت متأكد من حذف هذه السيارة نهائيًا؟</p>
                    <p class="tv-delete-warning">سيتم حذف بيانات السيارة وسجل الصيانة المرتبط بها.</p>
                    <div class="tv-delete-actions">
                        <button id="tv-delete-cancel" type="button">إلغاء</button>
                        <button id="tv-delete-confirm" type="button"><i class="fa-solid fa-trash-can"></i><span>نعم، احذف السيارة</span></button>
                    </div>
                </div>
            </div>
        `;
        if (recordsHeading) recordsView.replaceChildren(recordsHeading, recordsUi);
        else recordsView.replaceChildren(recordsUi);
        const responsiveStyle = document.createElement("style");
        responsiveStyle.textContent = `
            @media (max-width: 900px) {
                #tv-functional-records .tv-car-info-grid { grid-template-columns:minmax(0,1fr) !important; }
                #tv-functional-records .tv-detail-fields { grid-template-columns:minmax(95px,auto) minmax(0,1fr) !important; }
            }
            #tv-functional-records .tv-delete-modal { position:fixed; inset:0; z-index:99999; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(2,8,28,.78); backdrop-filter:blur(7px); }
            #tv-functional-records .tv-delete-dialog { width:min(100%,440px); padding:28px 24px 22px; border:1px solid #168bff; border-radius:20px; color:#f4f8ff; text-align:center; background:linear-gradient(145deg,#082d70 0%,#06152f 72%); box-shadow:0 0 0 1px rgba(0,190,255,.16),0 18px 60px rgba(0,0,0,.55),0 0 30px rgba(0,100,255,.22); }
            #tv-functional-records .tv-delete-icon { display:grid; place-items:center; width:62px; height:62px; margin:0 auto 14px; border:1px solid rgba(255,77,105,.65); border-radius:50%; color:#fff; background:linear-gradient(145deg,#ff536b,#b90d35); box-shadow:0 0 22px rgba(255,43,83,.25); font-size:25px; }
            #tv-functional-records .tv-delete-dialog h3 { margin:0 0 12px; font-size:23px; color:#fff; }
            #tv-functional-records .tv-delete-dialog p { margin:0 0 10px; line-height:1.8; color:#e4efff; }
            #tv-functional-records .tv-delete-dialog .tv-delete-warning { color:#8fc9ff; font-size:13px; }
            #tv-functional-records .tv-delete-actions { display:flex; gap:12px; margin-top:22px; }
            #tv-functional-records .tv-delete-actions button { flex:1; min-height:46px; padding:10px 14px; border-radius:10px; font:inherit; font-weight:700; cursor:pointer; transition:transform .15s,filter .15s; }
            #tv-functional-records .tv-delete-actions button:hover { filter:brightness(1.12); transform:translateY(-1px); }
            #tv-functional-records #tv-delete-cancel { border:1px solid #367ac4; color:#eaf4ff; background:#102b50; }
            #tv-functional-records #tv-delete-confirm { border:1px solid #ff7890; color:#fff; background:linear-gradient(135deg,#ff536b,#c5123b); box-shadow:0 4px 16px rgba(255,43,83,.2); }
            @media (max-width: 900px) {
                #tv-functional-records .tv-car-info-grid { grid-template-columns:minmax(0,1fr) !important; }
                #tv-functional-records .tv-detail-fields { grid-template-columns:minmax(95px,auto) minmax(0,1fr) !important; }
            }
            @media (max-width: 620px) {
                #tv-functional-records .tv-search-row { flex-wrap:wrap; }
                #tv-functional-records .tv-delete-button, #tv-functional-records .tv-search-button { flex:1 1 calc(50% - 6px); }
                #tv-functional-records .tv-search-input-wrap { flex:1 1 100%; order:3; }
                #tv-functional-records .tv-detail-fields { grid-template-columns:1fr !important; }
                #tv-functional-records .tv-delete-dialog { padding:24px 17px 18px; }
                #tv-functional-records .tv-delete-dialog h3 { font-size:20px; }
                #tv-functional-records .tv-delete-actions { flex-direction:column; }
            }
        `;
        recordsUi.appendChild(responsiveStyle);
        const searchInput = recordsUi.querySelector("#tv-record-search");
        const searchButton = recordsUi.querySelector("#tv-record-search-button");
        const deleteButton = recordsUi.querySelector("#tv-record-delete");
        const deleteModal = recordsUi.querySelector("#tv-delete-modal");
        const deleteModalMessage = recordsUi.querySelector("#tv-delete-message");
        const deleteCancelButton = recordsUi.querySelector("#tv-delete-cancel");
        const deleteConfirmButton = recordsUi.querySelector("#tv-delete-confirm");
        const status = recordsUi.querySelector("#tv-record-status");
        // الجزء 15.2: تشغيل نافذة التأكيد المخصصة بدل نافذة المتصفح البيضاء
        function showDeleteConfirmation(carId) {
            return new Promise(resolve => {
                deleteModalMessage.textContent = `هل أنت متأكد من حذف السيارة ${carId} نهائيًا؟`;
                deleteModal.style.display = "flex";
                deleteConfirmButton.focus();
                const finish = confirmed => {
                    deleteModal.style.display = "none";
                    deleteConfirmButton.removeEventListener("click", confirm);
                    deleteCancelButton.removeEventListener("click", cancel);
                    deleteModal.removeEventListener("click", backdropCancel);
                    document.removeEventListener("keydown", escapeCancel);
                    resolve(confirmed);
                };
                const confirm = () => finish(true);
                const cancel = () => finish(false);
                const backdropCancel = event => {
                    if (event.target === deleteModal) cancel();
                };
                const escapeCancel = event => {
                    if (event.key === "Escape") cancel();
                };
                deleteConfirmButton.addEventListener("click", confirm);
                deleteCancelButton.addEventListener("click", cancel);
                deleteModal.addEventListener("click", backdropCancel);
                document.addEventListener("keydown", escapeCancel);
            });
        }
        const results = recordsUi.querySelector("#tv-record-results");
        const detail = recordsUi.querySelector("#tv-record-detail");
        const list = recordsUi.querySelector("#tv-record-list");
        const historyBody = recordsUi.querySelector("#tv-history-body");
        const historyCount = recordsUi.querySelector("#tv-history-count");
        let allCars = [];
        let selectedCar = null;
        let isLoadingCars = false;
        const safeText = value => String(value == null || value === "" ? "—" : value);
        const escapeHtml = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
            "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
        }[char]));
        const formatNumber = value => {
            const number = Number(String(value ?? "").replace(/,/g, ""));
            return value !== "" && value != null && Number.isFinite(number) ? number.toLocaleString("fr-FR") : safeText(value);
        };
        // البحث في هذه الواجهة يكون بواسطة ID السيارة فقط، وليس العلامة أو الموديل.
        const findCar = query => {
            const q = String(query || "").replace(/\D/g, "");
            if (!q) return null;
            return allCars.find(car => String(car.id ?? "").replace(/\D/g, "") === q) || null;
        };
        function setStatus(message, isError = false) {
            status.textContent = message;
            status.classList.toggle("is-error", isError);
        }
        // لا نعرض قائمة سيارات أو بطاقات نتائج أسفل البحث؛ التفاصيل تظهر بعد الضغط على بحث فقط.
        function hideSearchResults() {
            results.style.display = "none";
            results.innerHTML = "";
        }
        function renderDetailFields(fields) {
            return fields.map(([label, value, icon = ""]) => `
                <div class="tv-field-label">${escapeHtml(label)}:</div>
                <div class="tv-field-value">${escapeHtml(safeText(value))}${icon ? `<i class="${icon}"></i>` : ""}</div>`).join("");
        }
        function renderCarDetails(car) {
            selectedCar = car;
            detail.style.display = "block";
            list.style.display = "none";
            const leftFields = [
                ["ID السيارة", car.id],
                ["تاريخ الصيانة", formatDateForDisplay(car.maintenance_date)],
                ["نوع السيارة", `${car.brand || ""} ${car.model || ""}`.trim()],
                ["سنة الصنع", car.year]
            ];
            const rightFields = [
                ["الكيلومتراج الحالية", car.mileage ? `${formatNumber(car.mileage)} كم` : "", "fa-solid fa-gauge-high"],
                ["العلامة التجارية للزيت", car.oil_brand, "fa-solid fa-oil-can"],
                ["تغيير القادم", car.next_service || (car.next_km ? `${formatNumber(car.next_km)} كم` : ""), "fa-regular fa-calendar-days"],
                ["نوع الزيت الحالي", car.oil, "fa-solid fa-droplet"]
            ];
            recordsUi.querySelector("#tv-detail-fields-left").innerHTML = renderDetailFields(leftFields);
            recordsUi.querySelector("#tv-detail-fields-right").innerHTML = renderDetailFields(rightFields);
            const customerUrl = `https://zzako0902-lang.github.io/top-vidange00/customer.html?token=${encodeURIComponent(car.access_token || "")}`;
            recordsUi.querySelector("#tv-detail-qr").src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(customerUrl)}`;
            recordsUi.querySelector("#tv-detail-qr-id").textContent = `ID: ${car.id || "—"}`;
            recordsUi.querySelector("#tv-open-customer-page").onclick = () => window.open(customerUrl, "_blank", "noopener");
            deleteButton.disabled = false;
            loadMaintenanceHistory(car.id);
        }
        function formatDateForDisplay(value) {
            if (!value) return "—";
            const raw = String(value).trim();
            const dmy = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (dmy) return raw;
            const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
            if (ymd) return `${ymd[3]}/${ymd[2]}/${ymd[1]}`;
            const parsed = new Date(raw);
            return Number.isNaN(parsed.getTime()) ? raw : `${String(parsed.getDate()).padStart(2,"0")}/${String(parsed.getMonth()+1).padStart(2,"0")}/${parsed.getFullYear()}`;
        }
        async function loadMaintenanceHistory(carId) {
            historyBody.innerHTML = `<tr><td colspan="7" class="tv-table-message">جاري تحميل سجل الصيانة...</td></tr>`;
            historyCount.textContent = "";
            try {
                const currentCar = allCars.find(item => String(item.id) === String(carId));
                if (!currentCar || !currentCar.access_token) throw new Error("رمز وصول السيارة غير متوفر؛ أعد تحميل القائمة.");
                const response = await fetch(`${recordsApiUrl}?action=history&token=${encodeURIComponent(currentCar.access_token)}&_=${Date.now()}`, { cache: "no-store" });
                if (!response.ok) throw new Error("تعذّر الاتصال بالخادم");
                const data = await response.json();
                if (!data.success || !Array.isArray(data.records)) throw new Error(data.message || "تعذّر قراءة سجل الصيانة");
                historyCount.textContent = `عدد العمليات: ${data.records.length}`;
                if (!data.records.length) {
                    historyBody.innerHTML = `<tr><td colspan="7" class="tv-table-message">لا يوجد سجل صيانة محفوظ لهذه السيارة.</td></tr>`;
                    return;
                }
                historyBody.innerHTML = data.records.map((record, index) => `<tr>
                    <td>${index + 1}</td><td>${escapeHtml(formatDateForDisplay(record.maintenance_date))}</td>
                    <td>${escapeHtml(formatNumber(record.mileage))} كم</td><td>${escapeHtml(safeText(record.oil))}</td>
                    <td>${escapeHtml(safeText(record.oil_brand))}</td><td>${escapeHtml(safeText(record.filters))}</td>
                    <td>${escapeHtml(safeText(record.notes))}</td></tr>`).join("");
            } catch (error) {
                historyCount.textContent = "";
                historyBody.innerHTML = `<tr><td colspan="7" class="tv-table-message is-error">تعذّر تحميل السجل: ${escapeHtml(error.message)}</td></tr>`;
            }
        }
        async function loadAllCars() {
            if (isLoadingCars) return false;
            isLoadingCars = true;
            setStatus("جاري تحميل السيارات من Google Sheets...");
            try {
                const adminPin = getAdminPin();
                if (!adminPin) throw new Error("يلزم إدخال الرقم السري للإدارة.");
                const response = await fetch(`${recordsApiUrl}?action=list&adminPin=${encodeURIComponent(adminPin)}&_=${Date.now()}`, { cache: "no-store" });
                if (!response.ok) throw new Error("تعذّر الاتصال بالخادم");
                const data = await response.json();
                if (!data.success || !Array.isArray(data.cars)) throw new Error(data.message || "استجابة غير صالحة من Google Sheets");
                allCars = data.cars;
                setStatus(allCars.length ? "جاهز للبحث. اكتب أرقام السيارة فقط ثم اضغط بحث." : "لا توجد سيارات مسجلة في الجدول.");
                return true;
            } catch (error) {
                setStatus(`تعذّر تحميل السيارات: ${error.message}. تأكد من نشر نسخة Apps Script التي تدعم action=list.`, true);
                return false;
            } finally {
                isLoadingCars = false;
            }
        }
        async function runSearch() {
            // اقبل الأرقام فقط حتى لو أُدخلت البادئة CAR- أو لُصقت مع الرقم.
            const query = String(searchInput.value || "").replace(/\D/g, "");
            searchInput.value = query;
            searchButton.disabled = true;
            try {
                if (!allCars.length) {
                    const loaded = await loadAllCars();
                    if (!loaded) return;
                }
                if (!query) {
                    selectedCar = null;
                    detail.style.display = "none";
                    hideSearchResults();
                    setStatus("اكتب رقم السيارة فقط ثم اضغط بحث.", true);
                    return;
                }
                hideSearchResults();
                const car = findCar(query);
                if (!car) {
                    selectedCar = null;
                    detail.style.display = "none";
                    hideSearchResults();
                    setStatus("لم يتم العثور على سيارة بهذا الـ ID. تحقق من الرقم وحاول مجددًا.", true);
                    return;
                }
                renderCarDetails(car);
                setStatus(`تم العثور على السيارة ${car.id}.`);
            } finally {
                searchButton.disabled = false;
            }
        }
        searchButton.addEventListener("click", runSearch);
        searchInput.addEventListener("keydown", event => {
            if (event.key === "Enter") { event.preventDefault(); runSearch(); }
        });
        searchInput.addEventListener("input", () => {
            // إزالة CAR- وأي أحرف فورًا؛ يبقى الرقم فقط ظاهرًا في الحقل.
            searchInput.value = String(searchInput.value || "").replace(/\D/g, "");
            // اكتب الأرقام فقط؛ البادئة CAR- موجودة في المعرّف المحفوظ. لا تظهر البيانات إلا بعد الضغط على بحث.
            selectedCar = null;
            detail.style.display = "none";
            hideSearchResults();
        });
        deleteButton.addEventListener("click", async () => {
            const car = selectedCar || findCar(searchInput.value);
            if (!car || !car.id) {
                setStatus("ابحث عن السيارة أولًا قبل حذفها.", true);
                return;
            }
            const confirmed = await showDeleteConfirmation(car.id);
            if (!confirmed) return;
            deleteButton.disabled = true;
            const original = deleteButton.innerHTML;
            deleteButton.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i><span>جارٍ الحذف...</span>`;
            setStatus(`جارٍ إرسال طلب حذف السيارة ${car.id}...`);
            try {
                // يتطلب هذا الطلب أن يدعم Apps Script action=deleteCar في doPost.
                const adminPin = getAdminPin();
                if (!adminPin) throw new Error("يلزم إدخال الرقم السري للإدارة.");
                await fetch(recordsApiUrl, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify({ action: "deleteCar", adminPin, id: String(car.id), deleteHistory: true })
                });
                // نتحقق من النتيجة بإعادة قراءة القائمة بدل الادعاء بالنجاح.
                allCars = [];
                const loaded = await loadAllCars();
                const stillExists = loaded && allCars.some(item => String(item.id).trim() === String(car.id).trim());
                if (loaded && !stillExists) {
                    selectedCar = null;
                    searchInput.value = "";
                    detail.style.display = "none";
                    hideSearchResults();
                    setStatus(`تم التأكد من حذف السيارة ${car.id} من القائمة.`);
                } else if (loaded && stillExists) {
                    setStatus("لم يتأكد حذف السيارة. غالبًا أن Apps Script لا يدعم action=deleteCar بعد؛ يلزم إضافة الحذف في Code.gs.", true);
                }
            } catch (error) {
                setStatus(`تعذّر إرسال طلب الحذف: ${error.message}`, true);
            } finally {
                deleteButton.disabled = false;
                deleteButton.innerHTML = original;
            }
        });
        recordsUi.querySelector("#tv-edit-car").addEventListener("click", () => {
            if (!selectedCar) return;
            if (carBrandSelect) carBrandSelect.value = selectedCar.brand || "";
            if (carModelSelect) carModelSelect.value = selectedCar.model || "";
            if (engineCapacitySelect) engineCapacitySelect.value = selectedCar.engine || "";
            if (prodYearInput) prodYearInput.value = selectedCar.year || "";
            if (currentKmInput) currentKmInput.value = selectedCar.mileage || "";
            if (filterTypeSelect) filterTypeSelect.value = selectedCar.filters || "";
            if (oilTypeSelect) oilTypeSelect.value = selectedCar.oil || "";
            if (oilBrandSelect) oilBrandSelect.value = selectedCar.oil_brand || "";
            if (nextVisitKmInput) nextVisitKmInput.value = selectedCar.next_km || "";
            if (maintenanceDateInput) {
                const rawDate = String(selectedCar.maintenance_date || "").trim();
                const dmy = rawDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
                const ymd = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
                if (dmy) maintenanceDateInput.value = `${dmy[3]}-${dmy[2]}-${dmy[1]}`;
                else if (ymd) maintenanceDateInput.value = `${ymd[1]}-${ymd[2]}-${ymd[3]}`;
                else {
                    const parsed = new Date(rawDate);
                    if (!rawDate || Number.isNaN(parsed.getTime())) {
                        const today = new Date();
                        maintenanceDateInput.value = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
                    } else maintenanceDateInput.value = `${parsed.getFullYear()}-${String(parsed.getMonth()+1).padStart(2,"0")}-${String(parsed.getDate()).padStart(2,"0")}`;
                }
            }
            if (notesInput) notesInput.value = selectedCar.notes || "";
            localStorage.setItem("topVidangeCurrentCarId", String(selectedCar.id));
            if (carIdDisplay) carIdDisplay.textContent = `معرّف السيارة: ${selectedCar.id}`;
            if (updateCarButton) updateCarButton.style.display = "block";
            updateLivePreview();
            document.getElementById("nav-add-car")?.click();
            setStatus("تم نقل بيانات السيارة إلى نموذج التحديث. راجع التاريخ والكيلومترات قبل الحفظ.");
        });
        setStatus("واجهة بيانات السيارات جاهزة. اكتب أرقام السيارة فقط ثم اضغط بحث.");
    }
});
