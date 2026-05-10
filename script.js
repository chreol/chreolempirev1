function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

document.addEventListener('DOMContentLoaded', () => {
    // UBA State Variables
    let currentUbaSegment = null;
    let currentUbaPrice = 0;

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
            valLabel.innerText = "Valeur de la carte (en devise)";
            Object.keys(tariffs.apps).forEach(v => {
                htmlVal += `<option value="${v}">${v} </option>`;
            });
        } else {
            valLabel.innerText = "Valeur de la carte (en devise)";
            Object.keys(tariffs.gaming).forEach(v => {
                htmlVal += `<option value="${v}">${v} </option>`;
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
        
        // Navbar & Floating Cart indicators
        const navCart = document.getElementById('navCart');
        const navCartCount = document.getElementById('navCartCount');
        const cartFloat = document.getElementById('cartFloat');
        const cartFloatCount = document.getElementById('cartFloatCount');

        const totalItems = window.cart.length;

        if (totalItems > 0) {
            if (navCart) navCart.style.display = "block";
            if (navCartCount) navCartCount.innerText = totalItems;
            if (cartFloat) cartFloat.style.display = "flex";
            if (cartFloatCount) cartFloatCount.innerText = totalItems;
        } else {
            if (navCart) navCart.style.display = "none";
            if (cartFloat) cartFloat.style.display = "none";
        }

        if (totalItems === 0) {
            if(cartSection) cartSection.style.display = "none";
            window.updateUSSD(0);
            return;
        }

        if(cartSection) cartSection.style.display = "block";
        let html = '';
        let grandTotal = 0;

        window.cart.forEach((item, index) => {
            grandTotal += item.totalPrice;
            html += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${escapeHtml(item.title)}</div>
                        <div class="cart-item-desc">${escapeHtml(item.desc)}</div>
                    </div>
                    <div class="cart-item-price">${(item._displayPrice !== undefined ? item._displayPrice : item.totalPrice).toLocaleString('fr-FR')} FCFA</div>
                    <button class="btn-remove-cart" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
                </div>
            `;
        });

        if(cartItems) cartItems.innerHTML = html;
        if(cartTotalPriceDisplay) cartTotalPriceDisplay.innerText = grandTotal.toLocaleString('fr-FR') + " FCFA";
        window.updateUSSD(grandTotal);
    };

    window.scrollToCart = function() {
        const cartSection = document.getElementById('cartSection');
        if (cartSection) {
            cartSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = 'cartes-cadeaux.html#cartSection';
        }
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

    // UBA Specific Logic
    window.switchUbaTab = function(el, tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');

        // Hide all tab contents
        document.querySelectorAll('.uba-tab-content').forEach(c => {
            c.style.display = 'none';
            c.style.opacity = '0';
        });

        // Show selected content and fade in
        const activeContent = document.getElementById('uba-' + tab);
        if (activeContent) {
            activeContent.style.display = 'block';
            // Animate with GSAP
            gsap.fromTo(activeContent,
                { opacity: 0, y: 15 },
                { opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' }
            );
        }
    };

    window.selectUbaSegment = function(el, segmentId) {
        const cards = document.querySelectorAll('.tier-card');
        const summary = document.getElementById('currentSegmentName');
        const priceEl = document.getElementById('ubaCardFinalPrice');
        const validityGroup = document.getElementById('validityGroup');
        
        cards.forEach(c => c.classList.remove('selected'));
        const selectedCard = el;
        selectedCard.classList.add('selected');
        
        // Elastic animation on click
        gsap.fromTo(selectedCard, 
            { scale: 0.95 }, 
            { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)" }
        );

        let price = 0;
        let segmentName = "";
        
        if (segmentId === 'seg1') { price = 10500; segmentName = "Segment I"; }
        else if (segmentId === 'seg2') { price = 17500; segmentName = "Segment II"; }
        else if (segmentId === 'seg3') { price = 25000; segmentName = "Segment III"; }
        
        currentUbaSegment = segmentName;
        currentUbaPrice = price;
        
        if(summary) summary.innerText = segmentName;
        
        if (segmentName === 'Segment I') {
            if(validityGroup) validityGroup.style.display = 'block';
            window.updateSegmentPrice();
        } else {
            if(validityGroup) validityGroup.style.display = 'none';
            if(priceEl) priceEl.innerText = price.toLocaleString('fr-FR') + " FCFA";
        }
        
        // Animate summary and price if elements exist
        const animTargets = [summary, priceEl].filter(Boolean);
        if (animTargets.length > 0) {
            gsap.from(animTargets, {
                opacity: 0,
                x: 10,
                stagger: 0.1,
                duration: 0.4,
                ease: "power2.out"
            });
        }
    };

    window.updateSegmentPrice = function() {
        if (currentUbaSegment === 'Segment I') {
            const val = parseInt(document.getElementById('ubaSegment1Val').value);
            currentUbaPrice = val;
            document.getElementById('ubaCardFinalPrice').innerText = val.toLocaleString('fr-FR') + " FCFA";
        }
    };

    window.calculateUbaRecharge = function() {
        const amount = parseInt(document.getElementById('ubaRechargeAmount').value) || 0;
        let fee = 0;

        if (amount > 0) {
            if (amount <= 20000) fee = 1500;
            else if (amount <= 50000) fee = 2000;
            else if (amount <= 100000) fee = Math.round(amount * 0.05);
            else if (amount <= 350000) fee = Math.round(amount * 0.04);
            else fee = Math.round(amount * 0.03);
        }

        const total = amount + fee;
        const totalEl = document.getElementById('ubaRechargeTotal');
        const feeEl = document.getElementById('ubaRechargeFee');
        
        if(totalEl) totalEl.innerText = total.toLocaleString('fr-FR') + " FCFA";
        if(feeEl) feeEl.innerText = fee > 0 ? `(Frais: ${fee.toLocaleString('fr-FR')} FCFA)` : "";
        return { amount, fee, total };
    };

    window.addUbaRechargeToCart = function() {
        const card6 = document.getElementById('ubaCard6').value;
        const card4 = document.getElementById('ubaCard4').value;
        const clientId = document.getElementById('ubaClientId').value;
        const fullName = document.getElementById('ubaFullName').value;
        const phone = document.getElementById('ubaPhone').value;
        const { amount, total } = window.calculateUbaRecharge();

        if (!card6 || !card4 || !clientId || !fullName || !phone || amount < 1500) {
            alert("Veuillez remplir tous les champs obligatoires (*) et entrer un montant minimum de 1 500 FCFA.");
            return;
        }

        const item = {
            title: `Recharge UBA: ${amount.toLocaleString('fr-FR')} FCFA`,
            desc: `Carte: ${card6}******${card4} | ID: ${clientId} | Client: ${fullName} | Tél: ${phone}`,
            totalPrice: total,
            qty: 1
        };

        window.addGenericToCart(item);
        
        // Reset fields
        ['ubaCard6', 'ubaCard4', 'ubaClientId', 'ubaFullName', 'ubaPhone', 'ubaRechargeAmount'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.value = "";
        });
        window.calculateUbaRecharge();
    };

    window.addUbaCardToCart = function() {
        const ownerName = document.getElementById('ubaOwnerName').value;

        if (!currentUbaSegment) {
            alert("Veuillez sélectionner un segment de carte (Segment I, II ou III).");
            return;
        }

        if (!ownerName) {
            alert("Veuillez entrer le nom complet du bénéficiaire.");
            return;
        }

        const item = {
            title: `Achat Carte UBA (${currentUbaSegment})`,
            desc: `Bénéficiaire: ${ownerName}`,
            totalPrice: currentUbaPrice,
            qty: 1
        };

        window.addGenericToCart(item);
        
        // Reset purchase form
        document.getElementById('ubaOwnerName').value = "";
        document.querySelectorAll('.tier-card').forEach(c => c.classList.remove('selected'));
        currentUbaSegment = null;  // null so the guard check works next time
        currentUbaPrice = 0;
        const segNameEl = document.getElementById('currentSegmentName');
        const segPriceEl = document.getElementById('ubaCardFinalPrice');
        if(segNameEl) segNameEl.innerText = "Aucun sélectionné";
        if(segPriceEl) segPriceEl.innerText = "0 FCFA";
        const vg = document.getElementById('validityGroup');
        if(vg) vg.style.display = 'none';
    };

    // WhatsApp / Contact modal handled by global openContactModal below

    const paypalRates = { vente: 500, achat: 700 };

    // achat = nous achetons au client (il vend), vente = nous vendons au client (il achète)
    const cryptoRates = { achat: 580, vente: 700 };

    const walletAddresses = {
        'USDT': {
            'TRC20 (Tron)':  { addr: 'TMiSeBpQQ7AeKzN34wvzC5uybXHFvcyfo6',                                  note: 'Réseau : Tron (TRC20)' },
            'BEP20 (BSC)':   { addr: '0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85',                           note: 'Réseau : BNB Smart Chain (BEP20)' },
            'Arbitrum (ARB)':{ addr: '0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85',                           note: 'Réseau : Arbitrum' },
            'SPL (Solana)':  { addr: 'Egme6fgZ1rQHcNfpDaNNsGh3LBe2aoou4FtuS8MCd71d',                        note: 'Réseau : Solana (SPL)' },
            'Aptos':         { addr: '0xb30a843b80c8B6Eda7Df0d80b0829263256fE85c8b370be02c977ae30eac1', note: 'Réseau : Aptos' },
            'Celo':          { addr: '0x640a90a213560756ea03a1cae5741b0b47495caa',              note: 'Réseau : Celo' },
            'Polkadot (DOT)':{ addr: '14ipdSddWWmkN4pJdk56WFM6BT1Y1zmfiXvDVyxGqPnsKHXk', note: 'Réseau : Polkadot (DOT)' }
        },
        'Bitcoin (BTC)': {
            'Bitcoin (BTC)': { addr: 'bc1q7qzvsrlyn96x6mwfs48hzqrcxfpsqusacj356k', note: 'Réseau : Bitcoin mainnet' }
        },
        'Tron (TRX)': {
            'TRC20 (Tron)': { addr: 'TMiSeBpQQ7AeKzN34wvzC5uybXHFvcyfo6', note: 'Réseau : Tron (TRX)' }
        },
        'USDC': {
            'BEP20 (BSC)':  { addr: '0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85',     note: 'Réseau : BNB Smart Chain (BEP20)' },
            'SPL (Solana)': { addr: 'Egme6fgZ1rQHcNfpDaNNsGh3LBe2aoou4FtuS8MCd71d', note: 'Réseau : Solana (SPL)' }
        },
        'Ethereum (ETH)': {
            'ERC20 (Ethereum)': { addr: '0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85', note: 'Réseau : Ethereum (ERC20)' }
        },
        'Litecoin (LTC)': {
            'Litecoin (LTC)': { addr: 'ltc1q2tlsexsslwwswkh6yk2nsuy4eu8ancwn9x9lgh', note: 'Réseau : Litecoin' }
        },
        'Solana': {
            'Solana (SOL)': { addr: 'Egme6fgZ1rQHcNfpDaNNsGh3LBe2aoou4FtuS8MCd71d', note: 'Réseau : Solana' }
        },
        'Cardano (ADA)': {
            'Cardano (ADA)': { addr: 'addr1q9mxu5zlhu3mlymfk84zxujj9arrn38gcx67nxnfm5dv43kdr5xh7gfcp3ehfjm9zjs4gwjjm9n5ln3cg0fn0v4gwm0s7uch3z', note: 'Réseau : Cardano' }
        },
        'Binance USD (BUSD)': {
            'BEP20 (BSC)': { addr: '0x7e0fE380958c8B6Eda7Df0d80b0829263256fE85', note: 'Réseau : BNB Smart Chain (BEP20)' }
        }
    };

    window.calculatePaypal = function() {
        const serviceEl = document.getElementById('paypalService');
        const amountEl = document.getElementById('paypalAmount');
        const convEl = document.getElementById('paypalConvertedAmount');
        const rateEl = document.getElementById('paypalRateInfo');
        const labelEl = document.getElementById('paypalConvLabel');
        if (!convEl) return;

        const service = serviceEl ? serviceEl.value : 'vente';
        const isVente = service === 'vente';
        const amount = parseFloat(amountEl ? amountEl.value : 0) || 0;
        const rate = paypalRates[service] || 500;
        const fcfa = Math.floor(amount * rate);

        if (labelEl) {
            labelEl.innerText = isVente
                ? '💰 Vous recevrez (FCFA)'
                : '💳 Vous paierez (FCFA)';
        }
        convEl.innerText = fcfa > 0 ? fcfa.toLocaleString('fr-FR') + ' FCFA' : '0 FCFA';
        if (rateEl) {
            rateEl.innerText = amount > 0
                ? `${amount}€ × ${rate} FCFA/€ = ${fcfa.toLocaleString('fr-FR')} FCFA`
                : '';
        }

        const sendInfo = document.getElementById('paypalSendInfo');
        const emailGroup = document.getElementById('paypalEmailGroup');
        const momoGroup = document.getElementById('paypalMomoGroup');
        if (sendInfo) sendInfo.style.display = isVente ? 'block' : 'none';
        if (emailGroup) emailGroup.style.display = isVente ? 'none' : 'block';
        if (momoGroup) momoGroup.style.display = isVente ? 'grid' : 'none';
    };

    window.addPayPalToCart = function() {
        const service = document.getElementById('paypalService')?.value;
        const amount = document.getElementById('paypalAmount')?.value?.trim();
        const email = document.getElementById('paypalEmail')?.value?.trim();
        const name = document.getElementById('paypalName')?.value?.trim();
        const network = document.getElementById('paypalNetwork')?.value;
        const phone = document.getElementById('paypalPhone')?.value?.trim();
        const isVente = service === 'vente';

        if (!amount || !name) {
            alert("Veuillez renseigner le montant et votre nom complet.");
            return;
        }
        if (isVente && !phone) {
            alert("Veuillez renseigner votre numéro de téléphone Mobile Money.");
            return;
        }
        if (!isVente && !email) {
            alert("Veuillez renseigner votre adresse email PayPal.");
            return;
        }

        const rate = paypalRates[service] || 500;
        const fcfa = Math.floor(parseFloat(amount) * rate);
        const serviceFull = isVente ? 'Retrait PayPal → FCFA' : 'Recharge PayPal ← FCFA';
        const desc = isVente
            ? `${fcfa.toLocaleString('fr-FR')} FCFA | ${network}: ${phone} (${name})`
            : `${fcfa.toLocaleString('fr-FR')} FCFA | ${email} (${name})`;

        const item = {
            title: `PayPal: ${serviceFull} — ${amount}€`,
            desc,
            totalPrice: isVente ? 0 : fcfa,
            _displayPrice: fcfa,
            _operation: service,
            qty: 1
        };

        window.addGenericToCart(item);
        ['paypalAmount', 'paypalEmail', 'paypalName', 'paypalPhone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        window.calculatePaypal();
    };

    window.sendPayPalOrder = function() {
        if (window.cart.length === 0) { alert("Votre panier est vide."); return; }
        const achatTotal = window.cart.filter(i => i._operation === 'achat').reduce((s, i) => s + i.totalPrice, 0);
        if (achatTotal > 0 && !currentMethod) {
            alert("Veuillez choisir un mode de paiement (MTN ou Orange Money) pour vos opérations Recharge.");
            return;
        }
        let orderDetails = "";
        const transactionId = "CMD-" + Math.floor(100000 + Math.random() * 900000);
        window.cart.forEach((item, index) => {
            const opLabel = item._operation === 'vente' ? '📤 Retrait' : '📥 Recharge';
            orderDetails += `*${opLabel} ${index + 1} :*%0A- ${item.title}%0A- ${item.desc}%0A%0A`;
        });
        const payLine = achatTotal > 0 ? `*Total à payer : ${achatTotal.toLocaleString('fr-FR')} FCFA*%0AMéthode : ${currentMethod}%0A%0A` : '';
        const msg = `Bonjour 👋%0AOpération(s) PayPal :%0A%0A*ID Transaction : ${transactionId}*%0A%0A${orderDetails}${payLine}Capture d'écran de paiement ci-jointe ⬇️`;
        window.cart = []; window.saveCart(); window.renderCart();
        window.open(`https://wa.me/237697657734?text=${msg}`, '_blank');
    };

    // type: 'achat' = nous achetons (client vend crypto, reçoit FCFA @580)
    //        'vente' = nous vendons (client achète crypto, paie FCFA @700)
    window.setCryptoOp = function(type) {
        document.getElementById('cryptoType').value = type;
        document.getElementById('tabAchat').classList.toggle('active', type === 'achat');
        document.getElementById('tabVente').classList.toggle('active', type === 'vente');
        const isAchat = type === 'achat';
        const rate = isAchat ? cryptoRates.achat : cryptoRates.vente;

        const opTitle   = document.getElementById('cryptoOpTitle');
        const rateBadge = document.getElementById('cryptoCurrentRate');
        if (opTitle)   opTitle.innerText   = isAchat ? '💰 Nous Rachetons vos Dollars / Crypto' : '💳 Achetez vos Cryptos au Meilleur Taux';
        if (rateBadge) rateBadge.innerText = `1$ = ${rate} FCFA`;
        if (rateBadge) {
            rateBadge.style.background   = isAchat ? 'rgba(37,211,102,0.12)' : 'rgba(212,175,55,0.1)';
            rateBadge.style.borderColor  = isAchat ? 'rgba(37,211,102,0.35)' : 'rgba(212,175,55,0.3)';
            rateBadge.style.color        = isAchat ? '#25D366' : 'var(--gold)';
        }

        const depositGroup = document.getElementById('cryptoDepositGroup');
        const walletGroup  = document.getElementById('cryptoWalletGroup');
        const momoGroup    = document.getElementById('cryptoMomoGroup');
        if (depositGroup) depositGroup.style.display = isAchat ? 'block' : 'none';
        if (walletGroup)  walletGroup.style.display  = isAchat ? 'none'  : 'block';
        if (momoGroup)    momoGroup.style.display    = isAchat ? 'grid'  : 'none';

        ['cryptoAmountUSD', 'cryptoAmountFCFA'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const rateEl = document.getElementById('cryptoRateInfo');
        if (rateEl) rateEl.innerText = '';

        if (isAchat) window.updateCoinNetworks();
    };

    window.updateCoinNetworks = function() {
        const coin    = document.getElementById('cryptoCoin')?.value;
        const netSel  = document.getElementById('cryptoCoinNetwork');
        const wDisplay = document.getElementById('cryptoWalletDisplay');
        if (!netSel) return;

        const nets = walletAddresses[coin] || {};
        netSel.innerHTML = '<option value="">— Sélectionnez le réseau —</option>';
        Object.keys(nets).forEach(n => {
            const opt = document.createElement('option');
            opt.value = n; opt.textContent = n;
            netSel.appendChild(opt);
        });

        if (Object.keys(nets).length === 1) {
            netSel.value = Object.keys(nets)[0];
            window.updateWalletAddress();
        } else {
            if (wDisplay) wDisplay.style.display = 'none';
        }
    };

    window.updateWalletAddress = function() {
        const coin    = document.getElementById('cryptoCoin')?.value;
        const network = document.getElementById('cryptoCoinNetwork')?.value;
        const wDisplay = document.getElementById('cryptoWalletDisplay');
        const addrEl  = document.getElementById('cryptoDepositAddr');
        const noteEl  = document.getElementById('cryptoDepositNetwork');
        if (!network || !walletAddresses[coin]?.[network]) {
            if (wDisplay) wDisplay.style.display = 'none';
            return;
        }
        const info = walletAddresses[coin][network];
        if (addrEl)  addrEl.innerText  = info.addr;
        if (noteEl)  noteEl.innerText  = info.note;
        if (wDisplay) wDisplay.style.display = 'block';
        const btn = document.getElementById('copyAddrBtn');
        if (btn) btn.innerText = 'Copier';
    };

    window.copyWalletAddr = function() {
        const addr = document.getElementById('cryptoDepositAddr')?.innerText;
        const btn  = document.getElementById('copyAddrBtn');
        if (!addr || !btn) return;
        navigator.clipboard?.writeText(addr)
            .then(() => { btn.innerText = '✓ Copié !'; setTimeout(() => btn.innerText = 'Copier', 2500); })
            .catch(() => { btn.innerText = '✓ Copié !'; });
    };

    window.calculateCrypto = function(fromField) {
        const type = document.getElementById('cryptoType')?.value || 'achat';
        const rate = type === 'achat' ? cryptoRates.achat : cryptoRates.vente;
        const usdEl  = document.getElementById('cryptoAmountUSD');
        const fcfaEl = document.getElementById('cryptoAmountFCFA');
        const rateEl = document.getElementById('cryptoRateInfo');
        if (!usdEl || !fcfaEl) return;

        if (fromField === 'usd') {
            const usd  = parseFloat(usdEl.value) || 0;
            const fcfa = usd > 0 ? Math.floor(usd * rate) : '';
            fcfaEl.value = fcfa !== '' ? fcfa : '';
            if (rateEl) rateEl.innerText = usd > 0 ? `${usd}$ × ${rate} FCFA/$ = ${Number(fcfa).toLocaleString('fr-FR')} FCFA` : '';
        } else {
            const fcfa = parseFloat(fcfaEl.value) || 0;
            const usd  = fcfa > 0 ? (fcfa / rate).toFixed(2) : '';
            usdEl.value = usd !== '' ? usd : '';
            if (rateEl) rateEl.innerText = fcfa > 0 ? `${fcfa.toLocaleString('fr-FR')} FCFA ÷ ${rate} = ${usd}$` : '';
        }
    };

    window.addCryptoToCart = function() {
        const coin       = document.getElementById('cryptoCoin')?.value;
        const type       = document.getElementById('cryptoType')?.value || 'achat';
        const isAchat    = type === 'achat';
        const usd        = document.getElementById('cryptoAmountUSD')?.value?.trim();
        const fcfaVal    = document.getElementById('cryptoAmountFCFA')?.value?.trim();
        const name       = document.getElementById('cryptoName')?.value?.trim();
        const wallet     = document.getElementById('cryptoWallet')?.value?.trim();
        const momoNet    = document.getElementById('cryptoNetwork')?.value;
        const phone      = document.getElementById('cryptoPhone')?.value?.trim();
        const coinNet    = document.getElementById('cryptoCoinNetwork')?.value; // réseau crypto (TRC20, BTC…)

        if (!usd || !fcfaVal) { alert("Veuillez renseigner le montant ($ ou FCFA)."); return; }
        if (!name)            { alert("Veuillez renseigner votre nom complet."); return; }
        if (isAchat && !coinNet) { alert("Veuillez sélectionner le réseau de votre crypto."); return; }
        if (!isAchat && !wallet) { alert("Veuillez renseigner votre adresse de wallet pour recevoir vos cryptos."); return; }
        if (isAchat && !phone)   { alert("Veuillez renseigner votre numéro Mobile Money pour recevoir vos FCFA."); return; }

        const usdF    = parseFloat(usd);
        const fcfa    = Math.floor(usdF * (isAchat ? cryptoRates.achat : cryptoRates.vente));
        const opLabel = isAchat ? 'Rachat' : 'Vente';
        const depositAddr = walletAddresses[coin]?.[coinNet]?.addr || '';
        const desc = isAchat
            ? `${usdF}$ → ${fcfa.toLocaleString('fr-FR')} FCFA | Réseau: ${coinNet}${depositAddr ? ' | Adresse: ' + depositAddr : ''} | MoMo: ${momoNet} ${phone} (${name})`
            : `${usdF}$ (${fcfa.toLocaleString('fr-FR')} FCFA) → Wallet: ${wallet} (${name})`;

        const item = {
            title: `Crypto ${opLabel} — ${usdF}$ en ${coin}`,
            desc,
            totalPrice: isAchat ? 0 : fcfa,   // vente: client paie FCFA via MoMo
            _displayPrice: fcfa,
            _operation: type,
            qty: 1
        };

        window.addGenericToCart(item);
        ['cryptoAmountUSD', 'cryptoAmountFCFA', 'cryptoName', 'cryptoWallet', 'cryptoPhone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const rateEl = document.getElementById('cryptoRateInfo');
        if (rateEl) rateEl.innerText = '';
    };

    window.sendCryptoOrder = function() {
        if (window.cart.length === 0) { alert("Votre panier est vide."); return; }
        // Vente = nous vendons = client paie FCFA via MoMo
        const venteTotal = window.cart.filter(i => i._operation === 'vente').reduce((s, i) => s + i.totalPrice, 0);
        if (venteTotal > 0 && !currentMethod) {
            alert("Veuillez choisir un mode de paiement (MTN ou Orange Money) pour vos achats de cryptos.");
            return;
        }
        let orderDetails = "";
        const transactionId = "CMD-" + Math.floor(100000 + Math.random() * 900000);
        window.cart.forEach((item, index) => {
            const opLabel = item._operation === 'achat' ? '💰 Rachat' : '💳 Vente';
            orderDetails += `*${opLabel} ${index + 1} :*%0A- ${item.title}%0A- ${item.desc}%0A%0A`;
        });
        const payLine = venteTotal > 0 ? `*Total à payer : ${venteTotal.toLocaleString('fr-FR')} FCFA*%0AMéthode : ${currentMethod}%0A%0A` : '';
        const msg = `Bonjour 👋%0ADemande d'échange Crypto :%0A%0A*ID Transaction : ${transactionId}*%0A%0A${orderDetails}${payLine}Capture d'écran de paiement ci-jointe ⬇️`;
        window.cart = []; window.saveCart(); window.renderCart();
        window.open(`https://wa.me/237697657734?text=${msg}`, '_blank');
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

    // --- COUPON EXCHANGE (coupons-codes.html) ---
    function computeCouponNet(type, value) {
        if (type === 'PCS') {
            // PCS : commission 7% prélevée sur la valeur euro, puis × 440 FCFA/€
            return Math.floor(value * 0.93 * 440);
        }
        // Transcash : montant × 440 FCFA/€ directement
        return Math.floor(value * 440);
    }

    window.calculateCouponNet = function() {
        const typeEl = document.getElementById('couponType');
        const valueEl = document.getElementById('couponValue');
        const netEl = document.getElementById('couponNetAmount');
        const rateEl = document.getElementById('couponRateInfo');
        if (!netEl) return;

        const type = typeEl ? typeEl.value : 'PCS';
        const value = parseFloat(valueEl ? valueEl.value : 0) || 0;
        const net = computeCouponNet(type, value);

        netEl.innerText = net > 0 ? net.toLocaleString('fr-FR') + ' FCFA' : '0 FCFA';
        if (rateEl) {
            if (value > 0 && type === 'PCS') {
                const netEur = (value * 0.93).toFixed(2);
                rateEl.innerText = `${value}€ − 7% = ${netEur}€ × 440 FCFA/€ = ${net.toLocaleString('fr-FR')} FCFA`;
            } else if (value > 0) {
                rateEl.innerText = `${value}€ × 440 FCFA/€ = ${net.toLocaleString('fr-FR')} FCFA`;
            } else {
                rateEl.innerText = '';
            }
        }
    };

    window.sendCouponOrder = function() {
        const type = document.getElementById('couponType')?.value;
        const value = document.getElementById('couponValue')?.value?.trim();
        const codes = document.getElementById('couponCodes')?.value?.trim();
        const beneficiary = document.getElementById('couponBeneficiary')?.value?.trim();
        const network = document.getElementById('couponNetwork')?.value;
        const phone = document.getElementById('couponPhone')?.value?.trim();

        if (!value || !codes || !beneficiary || !phone) {
            alert("Veuillez remplir tous les champs obligatoires (valeur, code(s), nom, téléphone).");
            return;
        }

        const net = computeCouponNet(type, parseFloat(value));
        const typeFull = type === 'PCS' ? 'PCS Mastercard' : 'Transcash';
        const codesEncoded = codes.split('\n').map(l => encodeURIComponent(l.trim())).filter(Boolean).join('%0A');

        const msg = `Bonjour%20%F0%9F%91%8B%0A*Demande%20d%27%C3%A9change%20de%20coupon*%0A%0A%F0%9F%8F%B7%EF%B8%8F%20*Type%20:*%20${encodeURIComponent(typeFull)}%0A%F0%9F%92%B6%20*Valeur%20totale%20:*%20${encodeURIComponent(value)}%E2%82%AC%0A%F0%9F%94%91%20*Code(s)%20:*%0A${codesEncoded}%0A%0A%F0%9F%93%B1%20*R%C3%A9ception%20Mobile%20Money%20:*%0A*Nom%20:*%20${encodeURIComponent(beneficiary)}%0A*R%C3%A9seau%20:*%20${encodeURIComponent(network)}%0A*N%C2%B0%20:*%20${encodeURIComponent(phone)}%0A%0A%F0%9F%92%B0%20*Montant%20net%20attendu%20:*%20${net.toLocaleString('fr-FR')}%20FCFA`;

        window.open(`https://wa.me/237697657734?text=${msg}`, '_blank');
    };

    window.addCouponExchangeToCart = function() {
        const type = document.getElementById('couponType')?.value;
        const value = document.getElementById('couponValue')?.value?.trim();
        const codes = document.getElementById('couponCodes')?.value?.trim();
        const beneficiary = document.getElementById('couponBeneficiary')?.value?.trim();
        const network = document.getElementById('couponNetwork')?.value;
        const phone = document.getElementById('couponPhone')?.value?.trim();

        if (!value || !codes || !beneficiary || !phone) {
            alert("Veuillez remplir tous les champs obligatoires (valeur, code(s), nom, téléphone).");
            return;
        }

        const net = computeCouponNet(type, parseFloat(value));
        const typeFull = type === 'PCS' ? 'PCS Mastercard' : 'Transcash';

        const item = {
            title: `Échange ${typeFull} — ${value}€`,
            desc: `Net: ${net.toLocaleString('fr-FR')} FCFA → ${network}: ${phone} (${beneficiary})`,
            totalPrice: net,
            qty: 1,
            _couponCodes: codes,
            _beneficiary: beneficiary,
            _network: network,
            _phone: phone,
            _typeFull: typeFull,
            _value: value,
            _net: net
        };

        window.addGenericToCart(item);

        // Réinitialiser le formulaire
        ['couponValue', 'couponCodes', 'couponBeneficiary', 'couponPhone'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        window.calculateCouponNet();
    };

    window.sendCouponCartOrder = function() {
        if (window.cart.length === 0) {
            alert("Votre panier est vide.");
            return;
        }

        let orderText = '';
        let grandTotal = 0;

        window.cart.forEach((item, index) => {
            grandTotal += item._net || item.totalPrice || 0;
            if (item._couponCodes) {
                const codesLines = item._couponCodes.split('\n').map(l => l.trim()).filter(Boolean).join('%0A    ');
                orderText += `*Échange ${index + 1} :*%0A`;
                orderText += `- Type : ${encodeURIComponent(item._typeFull)}%0A`;
                orderText += `- Valeur : ${encodeURIComponent(item._value)}€%0A`;
                orderText += `- Code(s) :%0A    ${codesLines}%0A`;
                orderText += `- Réception : ${encodeURIComponent(item._network)} — ${encodeURIComponent(item._phone)} (${encodeURIComponent(item._beneficiary)})%0A`;
                orderText += `- Montant net : *${(item._net || 0).toLocaleString('fr-FR')} FCFA*%0A%0A`;
            } else {
                orderText += `*Article ${index + 1} :* ${encodeURIComponent(item.title)}%0A${encodeURIComponent(item.desc)}%0A%0A`;
            }
        });

        const totalLine = grandTotal > 0 ? `%0A*Total net à recevoir : ${grandTotal.toLocaleString('fr-FR')} FCFA*` : '';
        const msg = `Bonjour%20%F0%9F%91%8B%0A*Demande(s)%20d'échange%20de%20coupons*%0A%0A${orderText}${totalLine}`;

        window.cart = [];
        window.saveCart();
        window.renderCart();
        window.open(`https://wa.me/237697657734?text=${msg}`, '_blank');
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
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

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

    // Initialize crypto deposit group on page load (achat is default tab)
    if (document.getElementById('cryptoCoinNetwork')) {
        window.updateCoinNetworks();
    }

    // Render cart on page load
    window.renderCart();
});

// Contact Modal Functions
window.openContactModal = function(e, prefilledMsg = "") {
    if(e) e.preventDefault();
    const contactModal = document.getElementById('contactModal');
    if(contactModal) {
        contactModal.style.display = "flex";
        if(prefilledMsg) {
            document.getElementById('contactMessage').value = prefilledMsg;
        }
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
