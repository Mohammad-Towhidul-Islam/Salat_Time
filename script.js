// বাংলাদেশ ইসলামিক ফাউন্ডেশনের API এন্ডপয়েন্ট (ডেমো URL)
const API_BASE_URL = 'https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1';

// জেলাভিত্তিক নামাজের সময় (ডেমো ডেটা)
const prayerTimesData = {
    dhaka: {
        Fajr: "4:30 AM",
        Dhuhr: "12:15 PM",
        Asr: "4:00 PM",
        Maghrib: "6:25 PM",
        Isha: "7:45 PM"
    },
    chittagong: {
        Fajr: "4:25 AM",
        Dhuhr: "12:10 PM",
        Asr: "3:55 PM",
        Maghrib: "6:20 PM",
        Isha: "7:40 PM"
    },
    sylhet: {
        Fajr: "4:20 AM",
        Dhuhr: "12:05 PM",
        Asr: "3:50 PM",
        Maghrib: "6:15 PM",
        Isha: "7:35 PM"
    },
    rajshahi: {
        Fajr: "4:35 AM",
        Dhuhr: "12:20 PM",
        Asr: "4:05 PM",
        Maghrib: "6:30 PM",
        Isha: "7:50 PM"
    },
    khulna: {
        Fajr: "4:33 AM",
        Dhuhr: "12:18 PM",
        Asr: "4:03 PM",
        Maghrib: "6:28 PM",
        Isha: "7:48 PM"
    },
    barisal: {
        Fajr: "4:28 AM",
        Dhuhr: "12:13 PM",
        Asr: "3:58 PM",
        Maghrib: "6:23 PM",
        Isha: "7:43 PM"
    },
    rangpur: {
        Fajr: "4:38 AM",
        Dhuhr: "12:23 PM",
        Asr: "4:08 PM",
        Maghrib: "6:33 PM",
        Isha: "7:53 PM"
    },
    mymensingh: {
        Fajr: "4:32 AM",
        Dhuhr: "12:17 PM",
        Asr: "4:02 PM",
        Maghrib: "6:27 PM",
        Isha: "7:47 PM"
    }
};

// DOM এলিমেন্টস
const districtSelect = document.getElementById('district-select');
const updateBtn = document.getElementById('update-btn');
const notificationBtn = document.getElementById('notification-btn');
const locationDisplay = document.getElementById('location');
const hijriDate = document.getElementById('hijri-date');
const gregorianDate = document.getElementById('gregorian-date');

// নামাজের সময় এলিমেন্টস
const fajrTime = document.getElementById('fajr-time');
const dhuhrTime = document.getElementById('dhuhr-time');
const asrTime = document.getElementById('asr-time');
const maghribTime = document.getElementById('maghrib-time');
const ishaTime = document.getElementById('isha-time');

// নামাজের কার্ড এলিমেন্টস
const fajrCard = document.getElementById('fajr-card');
const dhuhrCard = document.getElementById('dhuhr-card');
const asrCard = document.getElementById('asr-card');
const maghribCard = document.getElementById('maghrib-card');
const ishaCard = document.getElementById('isha-card');

// তারিখ আপডেট ফাংশন
function updateDates() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    gregorianDate.textContent = today.toLocaleDateString('bn-BD', options);
    
    // হিজরি তারিখ (সিমুলেটেড)
    const hijriMonths = ['মহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জুমাদাল উলা', 
                        'জুমাদাস সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'];
    const hijriDay = 29;
    const hijriMonth = hijriMonths[9]; // শাওয়াল
    const hijriYear = 1445;
    
    hijriDate.textContent = `আজ: ${hijriDay} ${hijriMonth}, ${hijriYear} হিজরি`;
}

// নামাজের সময় আপডেট ফাংশন
function updatePrayerTimes(district) {
    if (!district || !prayerTimesData[district]) {
        alert('দয়া করে একটি জেলা নির্বাচন করুন');
        return;
    }
    
    const times = prayerTimesData[district];
    
    // নামাজের সময় সেট করুন
    fajrTime.textContent = times.Fajr;
    dhuhrTime.textContent = times.Dhuhr;
    asrTime.textContent = times.Asr;
    maghribTime.textContent = times.Maghrib;
    ishaTime.textContent = times.Isha;
    
    // লোকেশন আপডেট করুন
    const districtNames = {
        dhaka: 'ঢাকা',
        chittagong: 'চট্টগ্রাম',
        sylhet: 'সিলেট',
        rajshahi: 'রাজশাহী',
        khulna: 'খুলনা',
        barisal: 'বরিশাল',
        rangpur: 'রংপুর',
        mymensingh: 'ময়মনসিংহ'
    };
    
    locationDisplay.textContent = `স্থান: ${districtNames[district]}`;
    
    // বর্তমান নামাজ হাইলাইট করুন
    highlightCurrentPrayer();
}

// বর্তমান নামাজ হাইলাইট ফাংশন
function highlightCurrentPrayer() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // সব কার্ড থেকে অ্যাক্টিভ ক্লাস রিমুভ করুন
    [fajrCard, dhuhrCard, asrCard, maghribCard, ishaCard].forEach(card => {
        card.classList.remove('active');
    });
    
    // নামাজের সময় পার্স করুন
    function parseTime(timeStr) {
        const [time, period] = timeStr.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        let hour24 = hours;
        
        if (period === 'PM' && hours !== 12) {
            hour24 += 12;
        } else if (period === 'AM' && hours === 12) {
            hour24 = 0;
        }
        
        return { hours: hour24, minutes };
    }
    
    // প্রতিটি নামাজের সময় চেক করুন
    const prayerTimes = [
        { card: fajrCard, time: fajrTime.textContent },
        { card: dhuhrCard, time: dhuhrTime.textContent },
        { card: asrCard, time: asrTime.textContent },
        { card: maghribCard, time: maghribTime.textContent },
        { card: ishaCard, time: ishaTime.textContent }
    ];
    
    let currentPrayerIndex = -1;
    
    for (let i = 0; i < prayerTimes.length; i++) {
        const { time } = prayerTimes[i];
        if (time === '--:--') continue;
        
        const { hours: prayerHour, minutes: prayerMinute } = parseTime(time);
        
        if (currentHour > prayerHour || (currentHour === prayerHour && currentMinute >= prayerMinute)) {
            currentPrayerIndex = i;
        } else {
            break;
        }
    }
    
    // যদি শেষ নামাজের পরের সময় হয়, তাহলে পরের দিনের ফজর পর্যন্ত কোন অ্যাক্টিভ থাকবে না
    if (currentPrayerIndex !== -1 && currentPrayerIndex < prayerTimes.length - 1) {
        prayerTimes[currentPrayerIndex].card.classList.add('active');
    }
}

// কিবলা দিকনির্দেশক ফাংশন
function findQiblaDirection() {
    if (!navigator.geolocation) {
        alert('আপনার ব্রাউজার জিওলোকেশন সাপোর্ট করে না');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            // বাংলাদেশের জন্য কিবলা দিক (সিম্পলিফাইড)
            const qiblaAngle = 90; // সাধারণত পশ্চিম দিকে
            
            document.getElementById('qibla-angle').innerHTML = `
                <p>আপনার বর্তমান অবস্থান: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}</p>
                <p>কিবলা দিক: <strong>পশ্চিম দিকে</strong> (প্রায় ${qiblaAngle} ডিগ্রী)</p>
                <p>কিবলা খুঁজে পেতে আপনার ফোনের কম্পাস ব্যবহার করুন</p>
            `;
        },
        error => {
            alert('আপনার লোকেশন পাওয়া যায়নি: ' + error.message);
        }
    );
}

// ইভেন্ট লিসেনারস
updateBtn.addEventListener('click', () => {
    updatePrayerTimes(districtSelect.value);
});

document.getElementById('find-qibla').addEventListener('click', findQiblaDirection);

notificationBtn.addEventListener('click', () => {
    alert('আজানের নোটিফিকেশন সেট করা হবে। এই ফিচারটি সম্পূর্ণরূপে ইমপ্লিমেন্ট করতে নোটিফিকেশন API ব্যবহার করুন।');
});

// পেজ লোড হলে ইনিশিয়ালাইজেশন
updateDates();
setInterval(highlightCurrentPrayer, 60000); // প্রতি মিনিটে হাইলাইট আপডেট

// ডেমোর জন্য ঢাকার সময়সূচী লোড করুন
window.addEventListener('load', () => {
    districtSelect.value = 'dhaka';
    updatePrayerTimes('dhaka');
});