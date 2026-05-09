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

    window.initValues = function() {
        const typeEl = document.getElementById('cardType');
        if(!typeEl) return;
        const type = typeEl.value;
        const cardVal = document.getElementById('cardVal');
        const valLabel = document.getElementById('valLabel');
        const exactCard = document.getElementById('exactCard');
        
        let htmlVal = "";
        let htmlExact = "";

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

        const unitPrice = tariffs[type][valChoice] || 0;
        const total = unitPrice * qty;
        display.innerText = total.toLocaleString('fr-FR') + " FCFA";
        
        window.updateUSSD(total);
    };

    window.selectPayment = function(method) {
        currentMethod = method;
        document.getElementById('mtn-btn').className = 'pay-card' + (method === 'MTN' ? ' active-mtn' : '');
        document.getElementById('om-btn').className = 'pay-card' + (method === 'OM' ? ' active-om' : '');
        window.updatePrice();
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
        const category = document.getElementById('cardType').options[document.getElementById('cardType').selectedIndex].text;
        const exactCard = document.getElementById('exactCard').value;
        const currency = document.getElementById('currency').value;
        const valChoice = document.getElementById('cardVal').value;
        const qty = document.getElementById('qty').value;
        const price = document.getElementById('totalPrice').innerText;
        
        if(!currentMethod) {
            alert("Veuillez choisir un mode de paiement (MTN ou Orange Money).");
            return;
        }

        const msg = `Bonjour 👋%0AJe souhaite valider ma commande :%0A- Catégorie : ${category}%0A- *Carte Exacte : ${exactCard}*%0A- Valeur : ${valChoice}%0A- Pays/Devise : ${currency}%0A- Quantité : ${qty}%0A%0A*Total à valider : ${price}*%0AMéthode de paiement : ${currentMethod}%0A%0AVoici ma capture d'écran de paiement ci-jointe ⬇️`;
        
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
});
