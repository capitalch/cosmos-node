let mustache = require("mustache");
let _ = require("lodash");

let pop = {};
let template = `[{
    "name": "label",
    "values": {{{label}}}

},
{
    "name": "General",
    "values": [{
        "name": "In the box",
        "value": "{{{inTheBox}}}"
    }, {
        "name": "Model Number",
        "value": "{{{modelNumber}}}"
    }, {
        "name": "Model Name",
        "value": "{{{modelName}}}"
    }, {
        "name": "Color",
        "value": "{{{color}}}"
    }, {
        "name": "Browse Type",
        "value": "{{{browseType}}}"
    }, {
        "name": "SIM Type",
        "value": "{{{simType}}}"
    }, {
        "name": "Hybrid Sim Slot",
        "value": "{{{hybridSimSlot}}}"
    }, {
        "name": "Touchscreen",
        "value": "{{{touchScreen}}}"
    }, {
        "name": "OTG Compatible",
        "value": "{{{otgCompatible}}}"
    }, {
        "name": "Quick Charging",
        "value": "{{{quickCharging}}}"
    }]
},
{
    "name": "Display Features",
    "values": [{
        "name": "Display Size",
        "value": "{{{displaySize}}}"
    }, {
        "name": "Resolution",
        "value": "{{{resolution}}}"
    }, {
        "name": "Resolution Type",
        "value": "{{{resolutionType}}}"
    }, {
        "name": "Display Type",
        "value": "{{{displayType}}}"
    }, {
        "name": "Other Display Features",
        "value": "{{{otherDisplayFeatures}}}"
    }]
},
{
    "name": "Os & Processor Features",
    "values": [{
        "name": "Operating System",
        "value": "{{{operatingSystem}}}"
    }, {
        "name": "Processor Type",
        "value": "{{{processorType}}}"
    }, {
        "name": "Processor Core",
        "value": "{{{processorCore}}}"
    }, {
        "name": "Primary Clock Speed",
        "value": "{{{primaryClockSpeed}}}"
    }, {
        "name": "Secondary Clock Speed",
        "value": "{{{secondaryClockSpeed}}}"
    }]
},
{
    "name": "Memory & Storage Features",
    "values": [{
        "name": "Internal Storage",
        "value": "{{{internalStorage}}}"
    }, {
        "name": "RAM",
        "value": "{{{ram}}}"
    }, {
        "name": "Expandable Storage",
        "value": "{{{expandableStorage}}}"
    }, {
        "name": "Supported Memory Card Type",
        "value": "{{{supportedMemoryCardType}}}"
    }, {
        "name": "Memory Card Slot Type",
        "value": "{{{memoryCardSlotType}}}"
    }, {
        "name": "Phone Book Memory",
        "value": "{{{phoneBookMemory}}}"
    }, {
        "name": "Call Log Memory",
        "value": "{{{callLogMemory}}}"
    }]
},
{
    "name": "Camera Features",
    "values": [{
        "name": "Primary Camera Available",
        "value": "{{{primaryCameraAvailable}}}"
    }, {
        "name": "Primary Camera",
        "value": "{{{primaryCamera}}}"
    }, {
        "name": "Primary Camera Features",
        "value": "{{{primaryCameraFeatures}}}"
    }, {
        "name": "Secondary Camera Available",
        "value": "{{{secondaryCameraAvailable}}}"
    }, {
        "name": "Secondary Camera",
        "value": "{{{secondaryCamera}}}"
    }, {
        "name": "Secondary Camera Features",
        "value": "{{{secondaryCameraFeatures}}}"
    }, {
        "name": "Flash",
        "value": "{{{flash}}}"
    }, {
        "name": "Video Recording",
        "value": "{{{videoRecording}}}"
    }]
},
{
    "name": "Call Features",
    "values": [{
        "name": "Phone Book",
        "value": "{{{phoneBook}}}"
    }]
},
{
    "name": "Connectivity Features",
    "values": [{
        "name": "Network Type",
        "value": "{{{networkType}}}"
    }, {
        "name": "Supported Networks",
        "value": "{{{supportedNetworks}}}"
    }, {
        "name": "Internet Connectivity",
        "value": "{{{internetConnectivity}}}"
    }, {
        "name": "3G",
        "value": "{{{threeG}}}"
    }, {
        "name": "Pre-installed Browser",
        "value": "{{{preInstalledBrowser}}}"
    }, {
        "name": "Bluetooth Support",
        "value": "{{{blueToothSupport}}}"
    }, {
        "name": "Bluetooth Version",
        "value": "{{{blueToothVersion}}}"
    }, {
        "name": "Wi-Fi",
        "value": "{{{wifi}}}"
    }, {
        "name": "USB Connectivity",
        "value": "{{{usbConnectivity}}}"
    }, {
        "name": "Audio Jack",
        "value": "{{{audioJack}}}"
    }]
},
{
    "name": "Other Details",
    "values": [{
        "name": "Smartphone",
        "value": "{{{smartPhone}}}"
    }, {
        "name": "SIM Size",
        "value": "{{{simSize}}}"
    }, {
        "name": "SMS",
        "value": "{{{sms}}}"
    }, {
        "name": "Sensors",
        "value": "{{{sensors}}}"
    }, {
        "name": "Other Features",
        "value": "{{{otherFeatures}}}"
    }, {
        "name": "Important Apps",
        "value": "{{{importantApps}}}"
    }]
},
{
    "name": "Multimedia Features",
    "values": [{
        "name": "Audio Formats",
        "value": "{{{audioFormats}}}"
    }, {
        "name": "Video Formats",
        "value": "{{{videoFormats}}}"
    }]
},
{
    "name": "Battery & Power Features",
    "values": [{
        "name": "Battery Capacity",
        "value": "{{{batteryCapacity}}}"
    }, {
        "name": "Battery Type",
        "value": "{{{batteryType}}}"
    }]
},
{
    "name": "Dimensions",
    "values": [{
        "name": "Width",
        "value": "{{{width}}}"
    }, {
        "name": "Height",
        "value": "{{{height}}}"
    }, {
        "name": "Depth",
        "value": "{{{depth}}}"
    }]
},
{
    "name": "Warranty",
    "values": [{
        "name": "Warranty Summary",
        "value": "{{{warrantySummary}}}"
    }]
}
]`;
let company = [
    'nikon', 'canon', 'sony', 'panasonic', 'olympus', 'photron', 'nokia', 'manfrotto', 'hmc', 
    'powerace', 'gionee', 'apple', 'intex', 'micromax',
    'oppo', 'samsung', 'vivo', 'karbon', 'syska', 'digitek', 'quickheal', 'philips', 'hp', 'lenovo', 'dell', 'enter', 
    'iball', 'asus', 'lg', 'logitech',
    'amkette', 'segate', 'wd', 'clarion', 'frontec', 'foxin', 'tvs', 'micromaxx', 'kingston', 'sandisk', 'transcend', 
    'micron', 'digisol',    'dlink', 'tplink', 'creative', 'zebronics', 'datawind', 'eyot', 'targus', 'bluestar', 
    'carrier', 'hitachi', 'llyod', 'mitsubisi', 'voltas', 'ogeneral',
    'casio', 'purit', 'hevells', 'symphony', 'electrolux', 'heier', 'venus', 'micromax', 'vu', 'tata', 'bajaj', 
    'glen', 'prestige', 'sunflame', 'zelsa',
    'agaro', 'bpl', 'videocon', 'texla', 'mi', 'zte', 'huawei', 'tcl', 'yulong', 'redmi'
];
pop.doPopulateBrand = (pool) => {
    let brand = '', sql = '';
    let sqlTemplate = `insert into brand(name) values('{{{brand}}}')`;
    for (let i = 0; i < company.length; i++) {
        brand = company[i];
        let tObject = { brand: brand};
        sql = mustache.render(sqlTemplate, tObject);
        pool.query(sql)
            .then(result => {
                Array.isArray(result) || (result = result.rows);
                //res.json(result);
                console.log(result);
            }
            ).catch(
                e => setImmediate(
                    () => {
                        console.log(e.message);
                    })
            );
    }

}

pop.doPopulate = (pool) => {
    let getDataS = () => {
        let dataS = {
            // label: _.sample([`['lava','8GB ram']`,`['mava','6GB RAM']`])
            label: _.sample([`["Lava Red", "8GB RAM", "64GB ROM"]`, `["Black", "4GB RAM", "Optical Sensor"]`, `["Pink", "2GB RAM", "Fingerprint Sensor"]`, `["White", "6GB RAM", "126GB ROM"]`, `["Night Black", "4GB RAM", "Optical Sensor", "Fingerprint Sensor"]`, `["Sapphire Blue", "6GB RAM", "Voice Recognition"]`, `["Coral White", "4GB RAM", "256GB ROM"]`, `["Transparent", "2GB RAM", "VOLTE"]`, `["Blue", "6GB RAM", "128GB ROM", "Carl Zeiss Lens"]`, `["White", "2GB RAM", "256GB ROM"]`])
            , inTheBox: _.sample([`Handset, Earphones Tuned by AKG, USB Type C Cable, Travel Adapter, USB Connector (C to A), Micro USB Connector (C to B), Ejector Pin, Quick Start and Smart Switch Leaflet`, `Handset, Earphones, USB Type C Cable, USB Connector, Quick Start Guide`, `Handset, Earphones, USB Type C Cable, Ejector Pin, Quick Leaflet`, `Handset, Data Cable, Travel Adaptor, Ejection Pin, Stereo Headset, USB Connector`, `Handset, Travel Adaptor, Data Cable, Battery, Stereo Headset`, `Handset, USB Cable, Adapter, SIM Tray Remover Pin, User Guide, Warranty Card`, `Handset, Turbo Charger, Wired Headset, Warranty Guide, Getting Started Guide`, `Handset, EarPods with Lightning Connector, Lightning to 3.5 mm Headphone Jack Adapter, Lightning to USB Cable, USB Power Adapter, Documentation`, `Handset, EarPods with Lightning Connector, Lightning to 3.5 mm Headphone Jack Adapter, Lightning to USB Cable, USB Power Adapter, Documentation`, `Handset, User Manual, 10W Rapid Charger and USB Cable`, `Handset, Battery, Charger, USB Cable, Earphones, Screen Guard, Back Cover, Warranty Card`, `Handset, Charger, Data Cable, Earphone, Ejector Pin`, `Handset, Battery, Earphones, Charger, User Guide`, `Handset, Headset, Charger, USB Cable, User Guide`, `Handset, Lightening Charger, Quick Start Guide, Data Cable, Headphone`])
            , modelNumber: _.sample(["SM-G950FZKDINS", "MQ3D2HN/A", "SM-J210FZDGINS", "SM-G930FZKUINS/SM-G930FZSUINS/SM-G930FZDUINS", "MQA62HN/A", "XT 1902-3", "SM-G925IZDAINS / SM-G925IZDAINU", "MN8X2HN/A", "XT 1686", "XT1770", "K33A42", "PA330113IN/PA330117IN", "SM-G900HZDAINS/INU", "GT-I9500DKYINS/INU", "SM-G850SZK"])
            , modelName: _.sample([`Galaxy S8`, `IPhone 6`, `Galaxy J2 Pro`, `Galaxy S7`, `iPhone X`, `K8 Note`, `Galaxy S6 Edge`, `iPhone 7`, `Moto G5 Plus`, `Moto E4 Plus`, `K6 Power`, `Vibe K5 Note`, `Galaxy S5`, `Galaxy S4`, `Galaxy Grand 2`])
            , color: _.sample([`Midnight Black`, `Pink`, `Red`, `Sapphire Blue`, `Blue`, `Black`, `White`, `Coral White`, `Transparent`, `Orange`])
            , browseType: _.sample([`Smartphones`, `Featurephones`])
            , simType: _.sample([`Dual Sim`, `Single Sim`])
            , hybridSimSlot: _.sample([`Yes`, `No`])
            , touchScreen: _.sample([`Yes`, `No`])
            , otgCompatible: _.sample([`Yes`, `No`])
            , quickCharging: _.sample([`Yes`, `No`])
            , displaySize: _.sample([`5.8 inch`, `5.2 inch`, `5.1 inch`, `5.25 inch`, `5.3 inch`, `5.4 inch`, `5.6 inch`, `5.7 inch`, `5.9 inch`, `6.0 inch`, `6.2 inch`, `6.1 inch`, `5.5 inch`, `4.9 inch`, `4.8 inch`])
            , resolution: _.sample([`2960 x 1440 pixels`, `1280 x 720 pixels`, `1920 x 1080 pixels`, `2560 X 1440 pixels`, `1334 x 750 pixels`])
            , resolutionType: _.sample([`Quad HD`, `Quad HD +`, `Retina HD Display`, `Full HD`, `Retina Display`])
            , displayType: _.sample([`Super AMOLED`, `AMOLED`, `IPS`])
            , otherDisplayFeatures: _.sample([`Corning Gorilla Glass 5`, `Corning Gorilla Glass 4`, `Corning Gorilla Glass 3`, `Corning Gorilla Glass 2`, `Corning Gorilla Glass 1`, `Multi-touch Display, 1400:1 Contrast Ratio, Wide Color Display (P3), 625 cd/m2 Maximum Brightness, Dual Domain Pixels for Wide Viewing Angles, Fingerprint Resistant Oleophobic Coating, Display of Multiple Languages and Characters Simultaneously, Display Zoom, Reachability`, `HDR Display, 1,000,000:1 Contrast Ratio (Typical), True Tone Display, Wide Color Display (P3), 3D Touch, 625 cd/m2 Max Brightness (Typical), Fingerprint-resistant Oleophobic Coating, Support for Display of Multiple Languages and Characters Simultaneously`, `IPS Display, 5 Point Multi-touch`])
            , operatingSystem: _.sample([`Android Marshmallow 6.0.1`, `Android Nougat 7`, `Android Lollipop 5`, `Android Marshmallow 6`, `Android Jelly Bean 4.2.2`, `iOS 10`, `iOS 11`, `iOS 9`, `iOS 8`, `iOS 7`, `iOS 6`])
            , processorType: _.sample([`Exynos 8895 Octa Core 2.3GHz`, `Apple A7 64-bit processor and M7 Motion Co-processor`, `A11 Bionic Chip with 64-bit Architecture, Neural Engine, Embedded M11 Motion Coprocessor`, `Apple A10 Fusion 64-bit processor and Embedded M10 Motion Co-processor`, `Qualcomm MSM8226 Snapdragon 400`, `Exynos 7420 Octa`, `Qualcomm MSM8996 Snapdragon 820 - G9350`, `Qualcomm MSM8998 Snapdragon 835`])
            , processorCore: _.sample([`Octa Core`, `Dual Core`, `Quad Core`])
            , primaryClockSpeed: _.sample([`2.3 GHz`, `1.3 GHz`, `2.1 GHz`, `1.8 GHz`, `2.2 GHz`, `2.4 GHz`, `2.5 GHz`])
            , secondaryClockSpeed: _.sample([`1.7 GHz`, `1.5 GHz`, `1.3 GHz`, `1.4 GHz`, `1 GHz`, `1.2 GHz`])
            , internalStorage: _.sample([`32 GB`, `16 GB`, `8 GB`, `64 GB`, `128 GB`])
            , ram: _.sample([`2 GB`, `4 GB`, `3 GB`, `1.5 GB`, `1 GB`, `6 GB`, `8 GB`])
            , expandableStorage: _.sample([`256 GB`, `128 GB`, `64 GB`, `32 GB`, `16 GB`])
            , supportedMemoryCardType: _.sample([`microSD`, `SD`])
            , memoryCardSlotType: _.sample([`Hybrid Slot`, `Dedicated Slot`])
            , phoneBookMemory: _.sample([`Yes`, `No`])
            , callLogMemory: _.sample([`Yes`, `No`])
            , primaryCameraAvailable: _.sample([`Yes`, `No`])
            , primaryCamera: _.sample([`12 MP`, `8 MP`, `10 MP`, `16 MP`, `20 MP`, `24 MP`, `18 MP`])
            , primaryCameraFeatures: _.sample([`Dual Pixel OIS (Optical image Stabilization)`, `Wide-angle and Telephoto Cameras, Wide-angle: f/1.8 Aperture, Telephoto: f/2.4 Aperture, Portrait Mode, Portrait Lighting (Beta), Dual Optical Image Stabilization, Six-element Lens, Panorama (Upto 63MP), Sapphire Crystal Lens Cover, Backside Illumination Sensor, Hybrid IR Filter, Autofocus with Focus Pixels, Tap to Focus with Focus Pixels, Live Photos with Stabilization, Wide Color Capture for Photos and Live Photos, Improved local Tone Mapping, Body and Face Detection, Exposure Control, Noise Reduction, Auto HDR for Photos, Auto Image Stabilization, Burst Mode, Timer Mode, Photo Geotagging, Image Formats Captured: HEIF and JPEG`, `f/1.8 Aperture, Optical Image Stabilization, Six Element Lens, Panorama (Upto 63 MP), Sapphire Crystal Lens Cover, Backside Illumination Sensor, Hybrid IR Filter, Autofocus with Focus Pixels, Tap to Focus with Focus Pixels, Live Photos with Stabilization, Wide Color Capture for Photos and Live Photos, Improved Local Tone Mapping, Body and Face Detection, Exposure Control, Noise Reduction, Auto HDR for Photos, Auto Image Stabilization, Burst Mode, Timer Mode, Photo Geotagging, Time Lapse Video with Stabilization, Cinematic Video Stabilization (1080p and 720p), Continuous Auto Focus Video, Take 8 MP Still Photos While Recording 4K Video, Playback Zoom, Video Geotagging`, `Auto Focus, Flash, Zero Shutter Lag, BIS, Dual Shot, Dual Recording, Sound and Shot, Drama Shot, Story Album, 360 Photo, Animated Photo, Eraser, Night, Best Photo, Best Face, Beauty Face, HDR (High Dynamic Range), Panorama, Sports`, `Dual Pixel, Auto Focus, Motion Mode, Panorama Mode, f/1.7, Hyperlapse, Slow Motion, Pro-mode, Live Broadcast, Video Collage, Virtual Shot, Food Mode`, `Auto Focus, F1.9, Real-time HDR, VOIS`, `PDAF with FHD Video Recording`])
            , secondaryCameraAvailable: _.sample([`Yes`, `No`])
            , secondaryCamera: _.sample([`2 MP`, `4 MP`, `6 MP`, `8 MP`, `5 MP`, `3 MP`])
            , secondaryCameraFeatures: _.sample([`Virtual Shot`, `Portrait Mode, Portrait Lighting (Beta), Animoji, 1080p HD Video Recording, f/2.2 Aperture, Wide Color Capture for Photos and Live Photos, Auto HDR, Backside Illumination Sensor, Body and Face Detection, Auto Image Stabilization, Burst Mode, Exposure Control, Timer Mode`, `1080p HD Video Recording, Retina Flash, f/2.2 Aperture, Wide Color Capture for Photos and Live Photos, Auto HDR, Backside Illumination Sensor, Body and Face Detection, Auto Image Stabilization, Burst Mode, Exposure Control, Timer Mode, FaceTime Video Calling Over Wi-Fi or Cellular`, `Zero Shutter Lag, BIS, Full HD Recording`, `Selfie Flash, f/1.7, CMOS`, `Auto Focus, F1.9, Real-time HDR`, `Fixed Focus`])
            , flash: _.sample([`No`, `Single LED Flash (Rear)`, `Dual LED`, `Rear Quad LED True Tone Flash with Slow Sync and Front Retina Flash`, `Quad LED True Tone Flash`, `LED`, `Yes`])
            , videoRecording: _.sample([`Yes`, `No`])
            , phoneBook: _.sample([`Yes`, `No`])
            , networkType: _.sample([`4G, 3G, 2G`, `3G, 2G`, `2G`])
            , supportedNetworks: _.sample([`4G LTE, 4G LTE`, `WCDMA`, `4G LTE, UMTS, GSM, WCDMA`, `GSM`])
            , internetConnectivity: _.sample([`4G, 3G, Wi-Fi`, `3G, Wi-Fi, EDGE`, `4G, 3G, Wi-Fi, GPRS, EDGE`, `3G, Wi-Fi, GPRS, EDGE`])
            , threeG: _.sample([`Yes`, `No`])
            , preInstalledBrowser: _.sample([`Android`, `iOS`])
            , blueToothSupport: _.sample([`Yes`, `No`])
            , blueToothVersion: _.sample([`v5.0`, `v4.0`, `v3.0`, `v2.0`, `v1.0`])
            , wifi: _.sample([`Yes`, `No`])
            , usbConnectivity: _.sample([`Yes`, `No`])
            , audioJack: _.sample([`3.5mm`, `2.5mm`])
            , smartPhone: _.sample([`Yes`, `No`])
            , simSize: _.sample([`Nano SIM (4FF)`, `Micro SIM (3FF)`, `Mini SIM (2FF)`])
            , sms: _.sample([`Yes`, `No`])
            , sensors: _.sample([`Accelerometer, Barometer, Fingerprint Sensor, Gyro Sensor, Geomagnetic Sensor, Hall Sensor, HR Sensor, Proximity Sensor, RGB Light Sensor, Iris Sensor, Pressure Sensor`, `Proximity Sensor, Three-axis Gyro Sensor, Accelerometer, Fingerprint Identity Sensor, Ambient Light Sensor, Digital Compass`, `Face ID, Barometer, Three-axis Gyro, Accelerometer, Proximity Sensor, Ambient Light Sensor`, `Accelerometer Sensor, Geo-magnetic Sensor, Gyro-sensor, Light Sensor, Pressure sensor, Proximity Sensor, Gesture Sensor, Temperature Sensor, Humidity sensor, Hall Sensor`, `Accelerometer, Barometer, Fingerprint Sensor, Gyro Sensor, Geo-magnetic Sensor, Hall Sensor, HR Sensor, Proximity Sensor, RGB Light Sensor`, `Finger Scanner, Geo-magnetic, Proximity Sensor, Heart Rate Monitor, Gyroscope, RGB Ambient Light Sensor, Hall Sensor, Accelerometer, Barometer`, `Gravity, Proximity, Light, Vibrator, Gyro, Fingerprint Sensor, Use the Fingerprint Reader to Effortlessly Click Selfies`, `Fingerprint, Accelerometer, Ambient Light, Proximity Sensor`, `Fingerprint Sensor, Gyro Sensor, Geomagnetic Sensor`, `Heart Rate Monitor, Gyroscope, RGB Ambient Light Sensor, Hall Sensor, Accelerometer`])
            , otherFeatures: _.sample([`LTE Cat 16 Capable, Water and Dust Resistance: IP68 Compatible, Fast Charging on Wired and Wireless, Wireless Charging Compatible with WPC and PMA`, `Video Recording: 4K Video Recording at 24 fps, 30 fps, or 60 fps, 1080P HD Video Recording at 30 fps or 60 fps, 720P HD Video Recording at 30 fps, Optical Image Stabilization for Video, Optical Zoom: 6x Digital Zoom, Quad LED True Tone Flash, Slo-Mo Video Support for 1080P at 120 fps or 240 fps, Time-lapse Video with Stabilization, Cinematic Video Stabilization (1080P and 720P), Continuous Autofocus Video, Body and Face Detection, Noise Reduction, Take 8MP Still Photos while Recording 4K Video, Playback Zoom, Video Geotagging, Video Formats Recorded: HEVC and H.264, Face ID: Enabled by TrueDepth Camera for Facial Recognition, Apple Pay, NFC with Reader Mode, Location: Digital Compass, Wi-Fi, Cellular, iBeacon Microlocation, Accessibility: VoiceOver, Zoom, Magnifier, Software TTY, Siri and Dictation, Type to Siri, Switch Control, Closed Captions, AssistiveTouch, Speak Screen, Rating for Hearing Aids: iPhone X (Model A1865, A1901): M3, T4, System Requirements - Apple ID (Required for Some Features), Syncing with iTunes on a Mac or PC Requires - Mac: OS X 10.10.5 or Later, PC: Windows 7 or Later, iTunes 12.7 or Later`, `Rated IP67 Under IEC Standard 60529, Audio Calling: FaceTime Audio, Voice Over LTE (VoLTE), Wi-Fi Calling, TV and Video: AirPlay Mirroring, Photos, Audio, Video-out to Apple TV (2nd Generation or Later), Apple Pay`, `Group Play: Share Music, Share Picture, Share Document, Play Games, S Translator, Optical Reader, Samsung Smart Scroll, Samsung Smart Pause, Air Gesture, Air View, S Travel (Trip Advisor), S Voice Drive, S Health, Samsung Adapt Display, Samsung Adapt Sound, Auto Adjust Touch Sensitivity (Glove Friendly), Safety Assistance, Samsung Link, Screen Mirroring, Samsung KNOX (B2B only), Samsung Hub, IR LED (Remote Control), MHL 2.0, Home Sync`, `Water and Dust Resistant (Capless Water and Dust Resistant IP68), Gear Support`, `Fast Charging, Wireless Charging, Download Booster`, `USB Mass Storage, eMMC, 4G + 2G DSDS Support, Video Codecs Decode and Encode: 1080p, Software Features: Moto Experiences (Light) + Dolby Atmos`, `Slo-Mo Video Support for 1080P at 120 fps or 240 fps, Time-lapse Video with Stabilization, Cinematic Video Stabilization (1080P and 720P), Continuous Autofocus Video, Body and Face Detection, Noise Reduction, Take 8MP Still Photos while Recording 4K Video, Playback Zoom`, `LTE Cat 16 Capable, Water and Dust Resistance: IP68 Compatible`, `Continuous Autofocus Video, Body and Face Detection, Noise Reduction`])
            , importantApps: _.sample([`SAMSUNG Pay, SAMSUNG Knox, MyGalaxy, SAMSUNG Health, SAMSUNG Gear, Smart Switch`, `Camera, Photos, Health, Messages, Phone, FaceTime, Mail, Music, Wallet, Siri, Calendar, iTunes Store, App Store, Notes, News, Contacts, iBooks, Home, Weather, Reminders, Clock, TV, Stocks, Calculator, Voice Memos, Compass, Podcasts, Watch, Tips, Find My iPhone, Find My Friends, Settings, Files`, `Siri, Air Drop, Air Play, Air Print, Control Center, Hand Off, Home Kit, iCloud, iCloud Keychain, Multitasking, Night Shift, Notification Center, Spotlight Search, iMovie, Pages, Keynote, Numbers, iTunes U, GarageBand, Apple Store, Trailers, Apple TV Remote, iTunes Remote, Music Memos, Find My iPhone, iCloud Drive, Find My Friends, Stocks, Watch, Maps`, `ChatON, Samsung WatchON, Samsung Kies, Kies Air, YouTube, Google Search, Google Maps, Gmail, Google Latitude, Google Play Store, Google Plus, YouTube, Google Talk, Google Places, Google Navigation, Google Downloads, Voice Search`, `S Voice`, `Drive, Gmail, Google+, Google Settings, Hangouts, Play Books, Play Games, Play Newsstand, Play Movie and TV, Play Music, Play Store, Voice Search, YouTube, Photos`, `LTE Cat 4: 150 Mbps (DL) / 50 Mbps (UL), Talk Time (4G): 33 hrs`, `RAM Type: LPDDR3, Metal Back with Polished Antenna Lines, Fingerprint Scanner`, `YouTube, Google Search, Google Maps, Gmail, Google Latitude`, `Air Play, Air Print, Control Center, Hand Off, Home Kit, iCloud`])
            , audioFormats: _.sample([`MP3, M4A, 3GA, AAC, OGG, OGA, WAV, WMA, AMR, AWB, FLAC, MID, MIDI, XMF, MXMF, IMY, RTTTL, RTX, OTA, DSF, DFF`, `MP3, M4A, 3GA, AAC`, `MXMF, IMY, RTTTL, RTX, OTA`, `FLAC, MID, MIDI, XMF, MXMF`, `MP3, M4A, 3GA, AAC`, `WAV, WMA, AMR, AWB`, `OGG, OGA, WAV, WMA, AMR, AWB, FLAC, MID`, `RTTTL, RTX, OTA`, `FLAC, MID, MIDI`, `MP3, M4A, 3GA, AAC, OGG, OGA, WAV, WMA, AMR, AWB, FLAC, MID, MIDI, XMF, MXMF`, `OTA`, `FLAC, MID, MIDI, XMF, MXMF`])
            , videoFormats: _.sample([`MP4, M4V, 3GP, 3G2, WMV, ASF, AVI, FLV, MKV, WEBM`, `MP4, M4V`, `M4V, 3GP, 3G2`, `WMV, ASF, AVI`, `WMV, ASF, AVI, FLV`, `FLV, MKV, WEBM`, `H.264, AAC-LC, M4V, MP4, MOV, MPEG4, AVI, PCM`])
            , batteryCapacity: _.sample([`3000 mAh`, `3600 mAh`, `2800 mAh`, `2400 mAh`, `4000 mAh`, `4200 mAh`, `5000 mAh`, `5500 mAh`, `6000 mAh`, `3200 mAh`])
            , batteryType: _.sample([`Li-Ion`, `Li-Polymer`])
            , width: _.sample([`68.1 mm`, `58.6 mm`, `70.9 mm`, `67.1 mm`, `69.8 mm`, `69.6 mm`, `70.1 mm`, `70.3 mm`, `72.3 mm`, `76 mm`])
            , height: _.sample([`148.9 mm`, `123.8 mm`, `143.6 mm`, `138.3 mm`, `136.6 mm`, `142.4 mm`, `142.1 mm`, `141.9 mm`, `143.6 mm`, `151 mm`])
            , depth: _.sample([`8 mm`, `7.6 mm`, `7.7 mm`, `7.1 mm`, `7.9 mm`, `7.9 mm`, `7 mm`, `9.3 mm`, `9.1 mm`, `8.4 mm`])
            , warrantySummary: _.sample([`Brand Warranty of 1 Year Available for Mobile and 6 Months for Accessories`, `Brand Warranty of 1 Year`, `1 Year for Mobile & 6 Months for Accessories`])
        };
        return (dataS);
    };
    let text = '', sql = '';
    let sqlTemplate = `update product set product_info='{{{text}}}' where id = {{{id}}}`;
    for (let i = 6001; i <= 56000; i++) {
        text = mustache.render(template, getDataS());
        let tObject = { text: text, id: i };
        sql = mustache.render(sqlTemplate, tObject);
        pool.query(sql)
            .then(result => {
                Array.isArray(result) || (result = result.rows);
                //res.json(result);
                console.log(result);
            }
            )
            .catch(
                e => setImmediate(
                    () => {
                        console.log(e.message);
                    })
            )
    }
    return;
};

module.exports = pop;