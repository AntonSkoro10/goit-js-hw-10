import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

function addLeadingZero(value) {
    return value < 10 ? '0' + value : value;
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}


const dataStart = document.querySelector('[data-start]');
const dateTimePicker = document.querySelector('#datetime-picker');
let userSelectedDate;
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];
        if (userSelectedDate < new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            dataStart.disabled = true;
        } else {
            dataStart.disabled = false;
        }
    },
};

flatpickr('#datetime-picker', options);

window.addEventListener('load', function() {
    dataStart.disabled = true;
});

dataStart.addEventListener('click', function () {
    this.disabled = true;
    dateTimePicker.disabled = true;
    const countdownInterval = setInterval(function () {
        const currentDate = new Date()
        const distance = userSelectedDate - currentDate
        if (distance <= 0) {
            clearInterval(countdownInterval)
            iziToast.success({
                title: 'Success',
                message: 'Countdown finished!',
            })
            dataStart.disabled = false
            dateTimePicker.disabled = false
            return
        }
        const { days, hours, minutes, seconds } = convertMs(distance)
        document.querySelector('[data-days]').innerText = addLeadingZero(days)
        document.querySelector('[data-hours]').innerText = addLeadingZero(hours)
        document.querySelector('[data-minutes]').innerText = addLeadingZero(minutes)
        document.querySelector('[data-seconds]').innerText = addLeadingZero(seconds)
    }, 1000)
})
