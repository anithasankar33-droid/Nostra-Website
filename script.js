/* =========================================================
   NOSTRA — script.js
   Shared behavior across all pages:
   1. Mobile nav toggle
   2. Collections page: search + category filter
   3. Contact page: form validation
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initCollections();
    initContactForm();
});

/* ---------------------------------------------------------
   1. Mobile nav toggle (used on every page)
--------------------------------------------------------- */
function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
        var isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        links.classList.toggle('open', !isOpen);
    });

    // Close the menu automatically once the viewport grows back to desktop size
    window.addEventListener('resize', function () {
        if (window.innerWidth > 720) {
            toggle.setAttribute('aria-expanded', 'false');
            links.classList.remove('open');
        }
    });
}

/* ---------------------------------------------------------
   2. Collections page — product data, search, filter
--------------------------------------------------------- */
var PRODUCTS = [
    {
        id: 'ss26-002',
        name: 'Field Jacket',
        category: 'Outerwear',
        fabric: 'Moss cotton twill',
        price: 4200,
        image:'image/Field Jacket.jpg'
    },
    {
        id: 'ss26-004',
        name: 'Wax Overshirt',
        category: 'Outerwear',
        fabric: 'Waxed cotton canvas',
        price: 3800,
        image:'image/Wax Overshirt.jpg'
    },
    {
        id: 'ss26-007',
        name: 'Shearling Vest',
        category: 'Outerwear',
        fabric: 'Shearling & suede',
        price: 5600,
        image:'image/Shearling Vest.jpg'
    },
    {
        id: 'ss26-011',
        name: 'Rib Tee',
        category: 'Tops',
        fabric: 'Combed cotton rib',
        price: 1150,
        image:'image/Rib Tee.jpg'
    },
    {
        id: 'ss26-012',
        name: 'Boxy Popover',
        category: 'Tops',
        fabric: 'Brushed flannel',
        price: 2100,
        image:'image/Boxy Popover.jpg'
    },
    {
        id: 'ss26-013',
        name: 'Mock Neck Knit',
        category: 'Tops',
        fabric: 'Merino wool',
        price: 2950,
        image:'image/Mock Neck Knit.jpg'
    },
    {
        id: 'ss26-014',
        name: 'Taper Trouser',
        category: 'Bottoms',
        fabric: 'Brushed twill',
        price: 2600,
        image:'image/Taper Trouser.jpg'
    },
    {
        id: 'ss26-015',
        name: 'Wide Leg Chino',
        category: 'Bottoms',
        fabric: 'Cotton chino',
        price: 2300,
        image:'image/Wide Leg Chino.jpg'
    },
    {
        id: 'ss26-016',
        name: 'Selvedge Denim',
        category: 'Bottoms',
        fabric: 'Raw selvedge denim',
        price: 3400,
        image:'image/Selvedge Denim.jpg'
    },
    {
        id: 'ss26-021',
        name: 'Canvas Tote',
        category: 'Accessories',
        fabric: 'Waxed canvas',
        price: 1400,
        image:'image/Canvas Tote.jpg'
    },
    {
        id: 'ss26-022',
        name: 'Wool Beanie',
        category: 'Accessories',
        fabric: 'Merino wool',
        price: 850,
        image:'image/Wool Beanie.jpg'
    },
    {
        id: 'ss26-023',
        name: 'Leather Belt',
        category: 'Accessories',
        fabric: 'Vegetable-tanned hide',
        price: 1600,
        image:'image/Leather Belt.jpg'
    },

    

];

function initCollections() {
    var grid = document.getElementById('product-grid');
    var chipsRow = document.getElementById('filter-chips');
    var searchInput = document.getElementById('search');
    var resultsCount = document.getElementById('results-count');
    if (!grid || !chipsRow || !searchInput) return; // not on collections.html

    var activeCategory = 'All';
    var categories = ['All'].concat(
        PRODUCTS.map(function (p) { return p.category; })
            .filter(function (cat, i, arr) { return arr.indexOf(cat) === i; })
    );

    // Build the filter chips once, from the category list above
    categories.forEach(function (cat) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chip';
        btn.textContent = cat;
        btn.setAttribute('aria-pressed', String(cat === 'All'));
        btn.addEventListener('click', function () {
            activeCategory = cat;
            Array.prototype.forEach.call(chipsRow.children, function (c) {
                c.setAttribute('aria-pressed', String(c === btn));
            });
            render();
        });
        chipsRow.appendChild(btn);
    });

    searchInput.addEventListener('input', render);

    function getFiltered() {
        var query = searchInput.value.trim().toLowerCase();
        return PRODUCTS.filter(function (p) {
            var matchesCategory = activeCategory === 'All' || p.category === activeCategory;
            var matchesSearch = !query ||
                p.name.toLowerCase().indexOf(query) !== -1 ||
                p.fabric.toLowerCase().indexOf(query) !== -1 ||
                p.category.toLowerCase().indexOf(query) !== -1;
            return matchesCategory && matchesSearch;
        });
    }

    function formatPrice(n) {
        return '₹' + n.toLocaleString('en-IN');
    }

    function render() {
        var results = getFiltered();
        grid.innerHTML = '';

        if (resultsCount) {
            resultsCount.textContent = results.length + ' of ' + PRODUCTS.length + ' pieces shown';
        }

        if (results.length === 0) {
            var empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.innerHTML = '<strong>No pieces match that search.</strong>Try a different name, fabric, or clear the category filter.';
            grid.appendChild(empty);
            return;
        }

        results.forEach(function (p) {
            var card = document.createElement('div');
            card.className = 'card';
            var imgUrl = p.image;

            card.innerHTML =
                '<div class="card-figure">' +
                '<span class="card-tag">' + p.category + '</span>' +
                '<img src="' + imgUrl + '" alt="' + p.name + '">' +
                '</div>' +
                '<div class="card-index">SS26 — ' + p.id.split('-')[1] + '</div>' +
                '<h3>' + p.name + '</h3>' +
                '<div class="card-meta"><span>' + p.fabric + '</span><span class="card-price">' + formatPrice(p.price) + '</span></div>';
            grid.appendChild(card);
        });
    }

    render();
}

/* ---------------------------------------------------------
   3. Contact page — lightweight client-side validation
--------------------------------------------------------- */
function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return; // not on contact.html

    var status = document.getElementById('form-status');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var valid = true;

        valid = validateField('name', function (v) { return v.length > 1; },
            'Please enter your name.') && valid;

        valid = validateField('email', function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
            'Please enter a valid email address.') && valid;

        valid = validateField('message', function (v) { return v.length > 9; },
            'Message should be at least 10 characters.') && valid;

        if (valid) {
            status.textContent = 'Thanks — your message has been sent. We\'ll reply within 2 business days.';
            status.classList.add('show');
            form.reset();
        } else {
            status.classList.remove('show');
        }
    });

    function validateField(id, isValid, message) {
        var input = document.getElementById(id);
        var fieldWrap = document.getElementById('field-' + id);
        var errorEl = document.getElementById('error-' + id);
        var value = input.value.trim();

        if (!isValid(value)) {
            fieldWrap.classList.add('error');
            errorEl.textContent = message;
            return false;
        }
        fieldWrap.classList.remove('error');
        errorEl.textContent = '';
        return true;
    }
}