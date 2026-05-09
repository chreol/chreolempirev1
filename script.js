document.addEventListener('DOMContentLoaded', () => {
    // Generate 25 reviews
    const reviews = [
        { name: "Marc D.", text: "Service incroyable, j'ai reçu ma carte PSN en 5 minutes chrono sur WhatsApp !", stars: 5 },
        { name: "Sophie T.", text: "Très fiable pour recharger ma carte UBA. Je recommande fortement.", stars: 5 },
        { name: "Alain K.", text: "Échange de crypto super rapide, le taux était très bon par rapport aux autres.", stars: 5 },
        { name: "Jeanne M.", text: "Enfin une solution pour acheter des cartes Roblox au Cameroun sans stress.", stars: 5 },
        { name: "Paul E.", text: "Support client très réactif, ils m'ont aidé à choisir la bonne carte iTunes.", stars: 4 },
        { name: "Eric B.", text: "Mon solde PayPal a été rechargé instantanément. Bravo l'équipe !", stars: 5 },
        { name: "Celine N.", text: "J'ai pu échanger mon coupon PCS facilement, merci Chreol Empire.", stars: 5 },
        { name: "David L.", text: "Fiabilité à 100%. Je paie toutes mes factures Canal+ chez eux maintenant.", stars: 5 },
        { name: "Vanessa R.", text: "Les V-Bucks sont arrivés sur mon compte en quelques minutes.", stars: 5 },
        { name: "Junior S.", text: "Carte Xbox reçue par mail très vite. Super service.", stars: 4 },
        { name: "Amina F.", text: "Meilleur endroit pour les cartes cadeaux à Douala, rien à dire.", stars: 5 },
        { name: "Franck O.", text: "J'avais des doutes au début mais c'est 100% légit et rapide.", stars: 5 },
        { name: "Lucie P.", text: "Je recommande pour les recharges UBA, c'est vraiment rapide.", stars: 5 },
        { name: "Fabrice M.", text: "Les gars sont pros, j'achète mes cartes Free Fire ici tout le temps.", stars: 5 },
        { name: "Christelle Y.", text: "C'est la 3ème fois que j'achète des cartes PSN, toujours parfait.", stars: 5 },
        { name: "Serge T.", text: "Top service, rapide et sécurisé pour l'achat de USDT.", stars: 5 },
        { name: "Nadia C.", text: "Paiement Momo très pratique, on reçoit le code tout de suite.", stars: 5 },
        { name: "Yves D.", text: "Le service client sur WhatsApp est top, réponse en quelques secondes.", stars: 4 },
        { name: "Michelle K.", text: "Je cherchais des cartes Nintendo, je les ai trouvées ici. Merci !", stars: 5 },
        { name: "Hervé G.", text: "Super pour convertir mes coupons Transcash en FCFA, rapide !", stars: 5 },
        { name: "Alice V.", text: "Je suis au Gabon et j'achète via Momo sans souci. Super !", stars: 5 },
        { name: "Patrick W.", text: "Rien à dire, le service est premium comme annoncé.", stars: 5 },
        { name: "Diane B.", text: "J'ai acheté une carte pour l'anniversaire de mon fils, il était ravi.", stars: 5 },
        { name: "Christian L.", text: "Je fais mes échanges Bitcoin ici, c'est très sécurisé.", stars: 5 },
        { name: "Isabelle N.", text: "Service impeccable, on se sent vraiment en confiance.", stars: 5 }
    ];

    const track = document.getElementById('marquee-track');

    function createReviewCards() {
        let html = '';
        reviews.forEach(review => {
            const starsHtml = Array(review.stars).fill('<i class="fas fa-star"></i>').join('');
            html += `
                <div class="review-card">
                    <div class="review-stars">${starsHtml}</div>
                    <div class="review-text">"${review.text}"</div>
                    <div class="review-author">- ${review.name}</div>
                </div>
            `;
        });
        return html;
    }

    // We append the reviews twice to allow for seamless scrolling
    const cardsHtml = createReviewCards();
    if (track) {
        track.innerHTML = cardsHtml + cardsHtml;
    }

    // --- FORM LOGIC ---
    let currentMethod = "";

    const tariffs = {
        gaming: { 10: 7500, 20: 14500, 30: 22000, 50: 35000, 100: 68500 , 150: 102000, 200: 135000, 300: 204000, 500: 340000 },
        apps: { 5: 4000, 10: 7500, 20: 14500, 25: 18000, 50: 35500, 100: 68500 },
        robux: { 100: 2500, 200: 3500, 300: 4500, 400: 5500, 800: 10000, 1000: 13000, 2000: 23500 }
    };

    const specificCards = {
        gaming: ["PlayStation (PSN)", "Xbox", "Nintendo", "Roblox", "Free Fire", "Fortnite", "PUBG", "Autre (préciser)"],
        apps: ["iTunes / Apple", "Google Play"],
        robux: ["ROBUX"]
    };

    let savedCart = localStorage.getItem('chreol_cart');
    window.cart = savedCart ? JSON.parse(savedCart) : [];

    window.saveCart = function() {
        localStorage.setItem('chreol_cart', JSON.stringify(window.cart));
    };

    window.addGenericToCart = function(item) {
        window.cart.push(item);
        window.saveCart();
        window.renderCart();
    };

    // Render cart on page load if the elements exist
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('cartItems')) {
            window.renderCart();
        }
    });

    window.initValues = function() {
        const typeEl = document.getElementById('cardType');
        if(!typeEl) return;
        const type = typeEl.value;
        const cardVal = document.getElementById('cardVal');
        const valLabel = document.getElementById('valLabel');
        const exactCard = document.getElementById('exactCard');
        
        let htmlVal = `<option value="" disabled selected>Sélectionnez une valeur</option>`;
        let htmlExact = `<option value="" disabled selected>Sélectionnez une carte</option>`;

        if (!type) {
            exactCard.innerHTML = htmlExact;
            cardVal.innerHTML = htmlVal;
            window.updatePrice();
            return;
        }

        // Populate Exact Cards
        specificCards[type].forEach(c => {
            htmlExact += `<option value="${c}">${c}</option>`;
        });
        exactCard.innerHTML = htmlExact;

        if (type === "robux") {
            valLabel.innerText = "Quantité de ROBUX";
            Object.keys(tariffs.robux).forEach(v => {
                htmlVal += `<option value="${v}">${v} ROBUX</option>`;
            });
        } else if (type === "apps") {
            valLabel.innerText = "Valeur de la carte";
            Object.keys(tariffs.apps).forEach(v => {
                htmlVal += `<option value="${v}">${v}</option>`;
            });
        } else {
            valLabel.innerText = "Valeur de la carte";
            Object.keys(tariffs.gaming).forEach(v => {
                htmlVal += `<option value="${v}">${v}</option>`;
            });
        }

        cardVal.innerHTML = htmlVal;
        window.handleValueSelection();
    };

    window.handleValueSelection = function() {
        window.updatePrice();
    };

    window.updatePrice = function() {
        const type = document.getElementById('cardType').value;
        const valChoice = document.getElementById('cardVal').value;
        const qty = parseInt(document.getElementById('qty').value) || 1;
        const display = document.getElementById('totalPrice');

        let unitPrice = 0;
        if (type && valChoice && tariffs[type] && tariffs[type][valChoice]) {
            unitPrice = tariffs[type][valChoice];
        }
        
        const total = unitPrice * qty;
        display.innerText = total.toLocaleString('fr-FR') + " FCFA";
    };

    window.addToCart = function() {
        const typeEl = document.getElementById('cardType');
        const category = typeEl.options[typeEl.selectedIndex]?.text;
        const typeValue = typeEl.value;
        const exactCard = document.getElementById('exactCard').value;
        const currency = document.getElementById('currency').value;
        const valChoice = document.getElementById('cardVal').value;
        const qty = parseInt(document.getElementById('qty').value) || 1;

        if (!typeValue || !exactCard || !currency || !valChoice) {
            alert("Veuillez remplir toutes les informations de la carte avant d'ajouter au panier.");
            return;
        }

        const unitPrice = tariffs[typeValue][valChoice];
        const totalPrice = unitPrice * qty;

        const item = {
            title: `${qty}x ${exactCard} (${category})`,
            desc: `${valChoice} | ${currency}`,
            totalPrice: totalPrice,
            qty: qty
        };

        window.addGenericToCart(item);
        
        // Reset form
        typeEl.value = "";
        document.getElementById('currency').value = "";
        document.getElementById('qty').value = "1";
        window.initValues();
    };

    window.renderCart = function() {
        const cartSection = document.getElementById('cartSection');
        const cartItems = document.getElementById('cartItems');
        const cartTotalPriceDisplay = document.getElementById('cartTotalPrice');
        
        if (window.cart.length === 0) {
            cartSection.style.display = "none";
            window.updateUSSD(0);
            return;
        }

        cartSection.style.display = "block";
        let html = '';
        let grandTotal = 0;

        window.cart.forEach((item, index) => {
            grandTotal += item.totalPrice;
            html += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-desc">${item.desc}</div>
                    </div>
                    <div class="cart-item-price">${item.totalPrice.toLocaleString('fr-FR')} FCFA</div>
                    <button class="btn-remove-cart" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });

        cartItems.innerHTML = html;
        cartTotalPriceDisplay.innerText = grandTotal.toLocaleString('fr-FR') + " FCFA";
        window.updateUSSD(grandTotal);
    };

    window.removeFromCart = function(index) {
        window.cart.splice(index, 1);
        window.saveCart();
        window.renderCart();
    };

    window.selectPayment = function(method) {
        currentMethod = method;
        document.getElementById('mtn-btn').className = 'pay-card' + (method === 'MTN' ? ' active-mtn' : '');
        document.getElementById('om-btn').className = 'pay-card' + (method === 'OM' ? ' active-om' : '');
        
        let grandTotal = window.cart.reduce((sum, item) => sum + item.totalPrice, 0);
        window.updateUSSD(grandTotal);
    };

    window.updateUSSD = function(amount) {
        const box = document.getElementById('ussdBox');
        const info = document.getElementById('ussdInfo');
        const code = document.getElementById('ussdCode');

        if (amount === 0 || currentMethod === "") {
            if(box) box.style.display = "none";
            return;
        }

        if(box) box.style.display = "block";

        if (currentMethod === "MTN") {
            info.innerHTML = `<span style="color:#ffcc00; font-weight:bold;">MTN Money (Flotte)</span><br><small style="color:#A0A0A0;">Nom : ETS Contant</small>`;
            code.innerText = `*126*14*672416141*${amount}#`;
        } else {
            info.innerHTML = `<span style="color:#ff6600; font-weight:bold;">Orange Money (Transfert UV)</span><br><small style="color:#A0A0A0;">Nom : Ets Tagny</small>`;
            code.innerText = `#150*14*518554*692251299*${amount}#`;
        }
    };

    window.sendOrder = function() {
        if (window.cart.length === 0) {
            alert("Votre panier est vide.");
            return;
        }

        if(!currentMethod) {
            alert("Veuillez choisir un mode de paiement (MTN ou Orange Money).");
            return;
        }

        let orderDetails = "";
        let grandTotal = 0;
        const transactionId = "CMD-" + Math.floor(100000 + Math.random() * 900000);

        window.cart.forEach((item, index) => {
            grandTotal += item.totalPrice;
            orderDetails += `*Article ${index + 1} :*%0A`;
            orderDetails += `- ${item.title}%0A`;
            orderDetails += `- Détails : ${item.desc}%0A`;
            orderDetails += `- Prix : ${item.totalPrice.toLocaleString('fr-FR')} FCFA%0A%0A`;
        });

        const msg = `Bonjour 👋%0AJe souhaite valider ma commande :%0A%0A*ID Transaction : ${transactionId}*%0A%0A${orderDetails}*Total à valider : ${grandTotal.toLocaleString('fr-FR')} FCFA*%0AMéthode de paiement : ${currentMethod}%0A%0AVoici ma capture d'écran de paiement ci-jointe ⬇️`;
        
        window.cart = []; // Empty cart after order
        window.saveCart();
        window.renderCart();
        
        window.open(`https://wa.me/237697657734?text=${msg}`, '_blank');
    };

    // Service Specific Cart Additions
    window.addUBAToCart = function() {
        const service = document.getElementById('ubaService').value;
        const details = document.getElementById('ubaAmount').value;
        const qty = parseInt(document.getElementById('ubaQty').value) || 1;

        if (!details) {
            alert("Veuillez préciser le montant ou les détails.");
            return;
        }

        let price = (service === "Achat Carte Visa UBA") ? 10500 : 0;
        let numDetails = parseInt(details.replace(/[^0-9]/g, ''));
        if (!isNaN(numDetails) && service !== "Achat Carte Visa UBA") {
            price = numDetails;
        }

        const item = {
            title: `${qty}x ${service}`,
            desc: `Détails: ${details}`,
            totalPrice: price * qty,
            qty: qty
        };

        window.addGenericToCart(item);
        document.getElementById('ubaAmount').value = "";
    };

    window.addPayPalToCart = function() {
        const service = document.getElementById('paypalService').value;
        const amount = document.getElementById('paypalAmount').value;
        const email = document.getElementById('paypalEmail').value;

        if (!amount || !email) {
            alert("Veuillez remplir le montant et l'email.");
            return;
        }

        const item = {
            title: `PayPal: ${service}`,
            desc: `Montant: ${amount} | Email: ${email}`,
            totalPrice: 0,
            qty: 1
        };

        window.addGenericToCart(item);
        document.getElementById('paypalAmount').value = "";
        document.getElementById('paypalEmail').value = "";
    };

    window.addCryptoToCart = function() {
        const coin = document.getElementById('cryptoCoin').value;
        const type = document.getElementById('cryptoType').value;
        const amount = document.getElementById('cryptoAmount').value;

        if (!amount) {
            alert("Veuillez entrer le montant.");
            return;
        }

        const item = {
            title: `${type} ${coin}`,
            desc: `Montant: ${amount}`,
            totalPrice: 0,
            qty: 1
        };

        window.addGenericToCart(item);
        document.getElementById('cryptoAmount').value = "";
    };

    window.addCouponToCart = function() {
        const type = document.getElementById('couponType').value;
        const value = document.getElementById('couponValue').value;

        if (!value) {
            alert("Veuillez entrer la valeur du coupon.");
            return;
        }

        const item = {
            title: `Coupon ${type}`,
            desc: `Valeur: ${value}`,
            totalPrice: 0,
            qty: 1
        };

        window.addGenericToCart(item);
        document.getElementById('couponValue').value = "";
    };

    // Hero Cards Animation & Swiping
    const cards = document.querySelectorAll('.card-stack .card');
    const cardStack = document.getElementById('heroCardStack');

    if(cards.length > 0) {
        let activeIndex = 0;
        let autoPlayInterval;
        
        function positionCards() {
            cards.forEach((card, index) => {
                card.style.zIndex = index === activeIndex ? 10 : (cards.length - Math.abs(index - activeIndex));
                if(index === activeIndex) {
                    card.style.transform = `scale(1.05) translateY(-10px) rotate(0deg)`;
                    card.style.opacity = '1';
                } else {
                    const offset = index - activeIndex;
                    const rot = offset * 5;
                    const isMobile = window.innerWidth <= 768;
                    const transX = offset * (isMobile ? 8 : 15);
                    const transY = Math.abs(offset) * (isMobile ? 6 : 10);
                    card.style.transform = `scale(0.9) translate(${transX}px, ${transY}px) rotate(${rot}deg)`;
                    card.style.opacity = Math.abs(offset) > 2 ? '0' : '0.8';
                }
            });
        }
        
        positionCards();

        function nextCard() {
            activeIndex = (activeIndex + 1) % cards.length;
            positionCards();
        }

        function prevCard() {
            activeIndex = (activeIndex - 1 + cards.length) % cards.length;
            positionCards();
        }

        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextCard, 3000);
        }
        startAutoPlay();
        
        // Swipe logic for card stack
        let startX = 0;
        let endX = 0;
        
        function handleSwipe() {
            if (endX < startX - 50) { nextCard(); startAutoPlay(); }
            if (endX > startX + 50) { prevCard(); startAutoPlay(); }
        }

        if(cardStack) {
            cardStack.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; });
            cardStack.addEventListener('touchend', e => { endX = e.changedTouches[0].screenX; handleSwipe(); });
            cardStack.addEventListener('mousedown', e => { startX = e.screenX; });
            cardStack.addEventListener('mouseup', e => { endX = e.screenX; handleSwipe(); });
        }
        
        cards.forEach(card => card.addEventListener('dragstart', e => e.preventDefault()));

        // Modal Logic
        const modal = document.getElementById("imageModal");
        const modalImg = document.getElementById("modalImg");
        const span = document.getElementsByClassName("close-modal")[0];
        const prevBtn = document.getElementsByClassName("prev-modal")[0];
        const nextBtn = document.getElementsByClassName("next-modal")[0];
        let currentModalIndex = 0;

        function showModalImage(index) {
            currentModalIndex = index;
            modalImg.src = cards[currentModalIndex].src;
        }

        cards.forEach((card, index) => {
            card.addEventListener('click', function() {
                if(modal) {
                    modal.style.display = "flex";
                    showModalImage(index);
                }
            });
        });

        if(span) span.onclick = () => modal.style.display = "none";
        
        if(prevBtn) {
            prevBtn.onclick = (e) => {
                e.stopPropagation();
                showModalImage((currentModalIndex - 1 + cards.length) % cards.length);
            }
        }
        if(nextBtn) {
            nextBtn.onclick = (e) => {
                e.stopPropagation();
                showModalImage((currentModalIndex + 1) % cards.length);
            }
        }

        if(modalImg) modalImg.addEventListener('dragstart', e => e.preventDefault());

        if(modal) {
            modal.addEventListener('touchstart', e => { startX = e.changedTouches[0].screenX; });
            modal.addEventListener('touchend', e => { 
                endX = e.changedTouches[0].screenX; 
                if (endX < startX - 50) showModalImage((currentModalIndex + 1) % cards.length);
                if (endX > startX + 50) showModalImage((currentModalIndex - 1 + cards.length) % cards.length);
            });
            modal.addEventListener('mousedown', e => { startX = e.screenX; });
            modal.addEventListener('mouseup', e => { 
                endX = e.screenX; 
                if (endX < startX - 50) showModalImage((currentModalIndex + 1) % cards.length);
                else if (endX > startX + 50) showModalImage((currentModalIndex - 1 + cards.length) % cards.length);
                else if (e.target === modal) modal.style.display = "none";
            });
        }
    }

    // Initialize the form values on load
    if (document.getElementById('cardType')) {
        window.initValues();
    }
    // Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const nav = document.querySelector('nav');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Mobile Dropdown Toggle
    const dropbtn = document.querySelector('.dropbtn');
    const dropdown = document.querySelector('.dropdown');
    if (dropbtn) {
        dropbtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    }
});

// Contact Modal Functions
window.openContactModal = function(e) {
    if(e) e.preventDefault();
    const contactModal = document.getElementById('contactModal');
    if(contactModal) {
        contactModal.style.display = "flex";
    }
};

window.closeContactModal = function() {
    const contactModal = document.getElementById('contactModal');
    if(contactModal) {
        contactModal.style.display = "none";
    }
};

window.sendContactWhatsApp = function() {
    const name = document.getElementById('contactName').value;
    const phone = document.getElementById('contactPhone').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    if(!name || !phone || !email || !message) {
        alert("Veuillez remplir tous les champs du formulaire.");
        return;
    }

    const text = `Bonjour, je vous contacte depuis le site web :%0A%0A*Nom :* ${name}%0A*Téléphone :* ${phone}%0A*Email :* ${email}%0A*Message / Besoin :* %0A${message}`;
    window.open(`https://wa.me/237697657734?text=${text}`, '_blank');
    window.closeContactModal();
};

// Close contact modal if clicked outside
window.addEventListener('click', function(event) {
    const contactModal = document.getElementById('contactModal');
    if (event.target === contactModal) {
        window.closeContactModal();
    }
});
