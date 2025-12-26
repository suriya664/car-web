// ============================================
// BOOKING FUNCTIONALITY & INTERACTIVE FEATURES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Initialize Swiper for Testimonials
    if (typeof Swiper !== 'undefined') {
        const testimonialsSwiper = new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.testimonials-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.testimonials-swiper .swiper-button-next',
                prevEl: '.testimonials-swiper .swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });

        // Initialize Swiper for Special Offers
        const offersSwiper = new Swiper('.offers-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.offers-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.offers-swiper .swiper-button-next',
                prevEl: '.offers-swiper .swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                }
            }
        });
    }

    // Initialize Flatpickr for Date/Time Pickers
    if (typeof flatpickr !== 'undefined') {
        const pickupDate = document.getElementById('pickup-date');
        const returnDate = document.getElementById('return-date');

        if (pickupDate) {
            flatpickr(pickupDate, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: "today",
                time_24hr: true,
                onChange: function(selectedDates, dateStr, instance) {
                    // Set minimum date for return date
                    if (returnDate && selectedDates.length > 0) {
                        const returnPicker = returnDate._flatpickr;
                        if (returnPicker) {
                            returnPicker.set('minDate', selectedDates[0]);
                        }
                    }
                    calculateBookingPrice();
                }
            });
        }

        if (returnDate) {
            flatpickr(returnDate, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                minDate: "today",
                time_24hr: true,
                onChange: function() {
                    calculateBookingPrice();
                }
            });
        }
    }

    // Price Calculation Function
    function calculateBookingPrice() {
        const pickupDateInput = document.getElementById('pickup-date');
        const returnDateInput = document.getElementById('return-date');
        const priceDisplay = document.getElementById('calculated-price');

        if (!pickupDateInput || !returnDateInput) return;

        const pickupDate = pickupDateInput._flatpickr?.selectedDates[0];
        const returnDate = returnDateInput._flatpickr?.selectedDates[0];

        if (pickupDate && returnDate && returnDate > pickupDate) {
            const diffTime = Math.abs(returnDate - pickupDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            // Base price per day (can be dynamic based on selected car)
            const basePrice = 89; // Default price
            const totalPrice = basePrice * diffDays;

            if (priceDisplay) {
                priceDisplay.textContent = `$${totalPrice} (${diffDays} days)`;
                priceDisplay.style.display = 'block';
            }
        }
    }

    // Booking Form Submission
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const pickupLocation = document.getElementById('pickup-location')?.value;
            const dropoffLocation = document.getElementById('dropoff-location')?.value;
            const pickupDate = document.getElementById('pickup-date')?.value;
            const returnDate = document.getElementById('return-date')?.value;

            if (!pickupLocation || !dropoffLocation || !pickupDate || !returnDate) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            // Show loading state
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn?.textContent;
            if (submitBtn) {
                submitBtn.textContent = 'Searching...';
                submitBtn.disabled = true;
            }

            // Simulate API call
            setTimeout(() => {
                showMessage('Redirecting to fleet page...', 'success');
                setTimeout(() => {
                    window.location.href = 'fleet.html';
                }, 1500);
            }, 1000);
        });
    }

    // Show Message Function
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `booking-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#00FFFF' : '#FF00FF'};
            color: #0F0F1E;
            font-weight: bold;
            box-shadow: 0 0 20px ${type === 'success' ? '#00FFFF' : '#FF00FF'};
        `;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Car Details Page - Booking Calculator
    const carDetailsForm = document.querySelector('#car-details-booking-form');
    if (carDetailsForm) {
        const addons = carDetailsForm.querySelectorAll('input[type="checkbox"]');
        const dailyRateElement = document.querySelector('.car-card-price');
        const dailyRate = dailyRateElement ? parseFloat(dailyRateElement.textContent.replace(/[^0-9.]/g, '')) : 89;
        
        let pickupDateCar, returnDateCar;

        // Initialize date pickers
        if (typeof flatpickr !== 'undefined') {
            pickupDateCar = document.getElementById('pickup-dt');
            returnDateCar = document.getElementById('return-dt');

            if (pickupDateCar) {
                flatpickr(pickupDateCar, {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    minDate: "today",
                    time_24hr: true,
                    onChange: function(selectedDates) {
                        if (selectedDates.length > 0 && returnDateCar) {
                            const returnPicker = returnDateCar._flatpickr;
                            if (returnPicker) {
                                returnPicker.set('minDate', selectedDates[0]);
                            }
                        }
                        calculateCarDetailsPrice();
                    }
                });
            }

            if (returnDateCar) {
                flatpickr(returnDateCar, {
                    enableTime: true,
                    dateFormat: "Y-m-d H:i",
                    minDate: "today",
                    time_24hr: true,
                    onChange: calculateCarDetailsPrice
                });
            }
        }

        addons.forEach(addon => {
            addon.addEventListener('change', calculateCarDetailsPrice);
        });

        function calculateCarDetailsPrice() {
            const pickupDate = pickupDateCar?._flatpickr?.selectedDates[0];
            const returnDate = returnDateCar?._flatpickr?.selectedDates[0];

            if (!pickupDate || !returnDate || returnDate <= pickupDate) {
                // Reset prices if dates are invalid
                document.getElementById('days-count').textContent = '0';
                document.getElementById('base-price').textContent = '$0';
                document.getElementById('insurance-price').textContent = '$0';
                document.getElementById('gps-price').textContent = '$0';
                document.getElementById('childseat-price').textContent = '$0';
                document.getElementById('total-price').textContent = '$0';
                return;
            }

            const diffTime = Math.abs(returnDate - pickupDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let baseTotal = dailyRate * diffDays;
            let total = baseTotal;

            // Update days count and base price
            document.getElementById('days-count').textContent = diffDays;
            document.getElementById('base-price').textContent = `$${baseTotal.toFixed(2)}`;

            // Calculate addon prices
            addons.forEach(addon => {
                const price = parseFloat(addon.dataset.price) || 0;
                const addonTotal = addon.checked ? price * diffDays : 0;
                total += addonTotal;

                // Update individual addon price displays
                const addonId = addon.id;
                const priceElement = document.getElementById(addonId + '-price');
                if (priceElement) {
                    priceElement.textContent = `$${addonTotal.toFixed(2)}`;
                }
            });

            // Update total price
            const totalElement = document.getElementById('total-price');
            if (totalElement) {
                totalElement.textContent = `$${total.toFixed(2)}`;
            }
        }

        // Form submission
        carDetailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const pickupDate = pickupDateCar?._flatpickr?.selectedDates[0];
            const returnDate = returnDateCar?._flatpickr?.selectedDates[0];

            if (!pickupDate || !returnDate) {
                showMessage('Please select pickup and return dates', 'error');
                return;
            }

            showMessage('Booking request submitted! Redirecting...', 'success');
            setTimeout(() => {
                // In a real app, this would submit to a server
                console.log('Booking data:', {
                    pickupDate,
                    returnDate,
                    addons: Array.from(addons).filter(a => a.checked).map(a => a.id)
                });
            }, 1000);
        });
    }
});

