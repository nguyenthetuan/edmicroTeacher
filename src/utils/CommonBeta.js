import AppConst from '../constants/appConst';

import mathIcon from '../asserts/icon/math_icon.png';
import phyIcon from '../asserts/icon/phy_icon.png';
import chemIcon from '../asserts/icon/chem_icon.png';
import biologyIcon from '../asserts/icon/biology_icon.png';
import liteIcon from '../asserts/icon/lite_icon.png';
import historyIcon from '../asserts/icon/history_icon.png';
import geoIcon from '../asserts/icon/geo_icon.png';
import enIcon1 from '../asserts/icon/en_icon1.png';
import enIcon2 from '../asserts/icon/en_icon2.png';
import enIcon3 from '../asserts/icon/en_icon3.png';
import enIcon10 from '../asserts/icon/en10_icon.png';
import gdcdIcon from '../asserts/icon/ggcd_icon.png';
import mathImageHeader from '../asserts/appIcon/mathImageHeader.png';
import Icon_Tin_Hoc from '../asserts/appIcon/Icon_Tin_Hoc.png';
import iconGeo from '../asserts/appIcon/ic_georaphy_x60.png';
import icon_not_know from '../asserts/appIcon/icon_not_know.png'
const ArrayCodeYoutubeThayThang = [
    'VeFZhtp2MVU',
    'gb0ev--EE3Q',
    '3QO1UuJlqm0',
    '1MrDaS0nBeU',
    'Y_KB-B-H4k0',
    '4lw000uUrTA',
    'QUcWNiBnGNE',
];

const ArrayCodeYoutubeThayVu = [
    '3kitx9C75dw',
    '97agUC5LP5A',
    'cHb04hD9khc',
    'Rd6nAp4MHLY',
    'glwIFFxHqiQ',
    'M8D5giLrOPQ',
    'R2etLBqamI4',
    'LBN8ovKBVhA',
    'R2etLBqamI4',
    'LBN8ovKBVhA',
    'R78GNNk1y_I',
]

const ArrayCodeYoutubeThayThieu = [
    'hIf1MKmiwWU',
    'hHci5dLkg3U',
    'TaBShvr7Y5I',
    'GuUcCUmBqhk',
    'd8QsFuXo9pA',
    'SVj5uiqybaI',
    'tK09PVHKOk0',
    'q2TC-U2j5uQ',
    'uMZCEiZDmT0',
    'eMeOfpiObmQ',
    'On8KNxnE5mc',
    'VCV6JLWaQ_o',
    'lDpM2NDe-Vk',
    'H5rDszyC-V4',
    'RsHA18hwVkQ',
    '1lt2miMqXYg',
    'aOH3O0oEVi8',
    'BgMjbpqC8Sc'

]

const ArrayCodeYoutubeCoNhi = [
    'p3LQt4kLHBU',
    'p5cimp5Ek-k'
]

const getImageTeacher = (id) => {
    let result = { name: 'Đang cập nhật', image: '', star: 0 };
    if (ArrayCodeYoutubeThayThang.indexOf(`${id}`) >= 0) {
        result.name = 'Thầy Thắng';
        result.image = 'thaythang';
        result.star = 5;
    }
    if (ArrayCodeYoutubeThayVu.indexOf(`${id}`) >= 0) {
        result.name = 'Thầy Vũ';
        result.image = 'thayvu';
        result.star = 4;
    }
    if (ArrayCodeYoutubeThayThieu.indexOf(`${id}`) >= 0) {
        result.name = 'Thầy Thiệu';
        result.image = 'thaythieu';
        result.star = 5;
    }
    if (ArrayCodeYoutubeCoNhi.indexOf(`${id}`) >= 0) {
        result.name = 'Cô Nhi';
        result.image = 'conhi';
        result.star = 4;
    }
    return result;
}

const checkIsNullWithZero = (val) => {
    if (val == 0) {
        return true;
    }
    if (val != 0) {
        return !!val
    }
}

const getIconSubject = (id) => {
    switch (id) {
        case AppConst.mathID: return mathIcon;
        case AppConst.mathVao10ID: return mathIcon;
        case AppConst.mathThID: return mathIcon;


        case AppConst.phyID: return phyIcon;
        case AppConst.phyTHCSID: return phyIcon;

        case AppConst.chemID: return chemIcon;
        case AppConst.chemThID: return chemIcon;

        case AppConst.bioID: return biologyIcon;

        case AppConst.literID: return liteIcon;
        case AppConst.literIDTHCS: return liteIcon;

        case AppConst.hisID: return historyIcon;
        case AppConst.hisTHID: return historyIcon;

        case AppConst.geoID: return geoIcon;
        case AppConst.geoTHID: return geoIcon;

        case AppConst.engID: return enIcon;
        case AppConst.engTHPTID: return enIcon3;
        case AppConst.engTHPT2: return enIcon3;
        case AppConst.engTHPT3: return enIcon10;
        case AppConst.engGRM: return enIcon;
        case AppConst.engTHCS: return enIcon2;
        case AppConst.engID2: return enIcon2;

        case AppConst.tinhocID: return Icon_Tin_Hoc;
        case AppConst.gdcdID: return gdcdIcon;
        case AppConst.gdcdTHID: return gdcdIcon;
        case AppConst.geoID: return iconGeo;
        case AppConst.geoTHID: return iconGeo;

        default:
            return icon_not_know;
    }
};

const getImageHeaderSubject = (id) => {
    switch (id) {
        case AppConst.mathID: return mathImageHeader;
        case AppConst.mathVao10ID: return mathImageHeader;

        // case AppConst.phyID: return phyImageHeader;
        // case AppConst.phyTHCSID: return phyImageHeader;

        // case AppConst.chemID: return chemImageHeader;
        // case AppConst.chemThID: return chemImageHeader;

        // case AppConst.bioID: return biologyImageHeader;

        // case AppConst.literID: return liteImageHeader;
        // case AppConst.literIDTHCS: return liteImageHeader;

        // case AppConst.hisID: return historyImageHeader;
        // case AppConst.hisTHID: return historyImageHeader;

        // case AppConst.geoID: return geoImageHeader;
        // case AppConst.geoTHID: return geoImageHeader;

        // case AppConst.engID: return enImageHeader;
        // case AppConst.engTHPTID: return enImageHeader3;
        // case AppConst.engTHPT2: return enImageHeader3;
        // case AppConst.engTHPT3: return enImageHeader10;
        // case AppConst.engGRM: return enImageHeader;
        // case AppConst.engTHCS: return enImageHeader2;

        // case AppConst.gdcdID: return gdcdImageHeader;
        // case AppConst.gdcdTHID: return gdcdImageHeader;

        // dung tap khi chua co image mon hoc
        case AppConst.phyID: return phyIcon;
        case AppConst.phyTHCSID: return phyIcon;

        case AppConst.chemID: return chemIcon;
        case AppConst.chemThID: return chemIcon;

        case AppConst.bioID: return biologyIcon;

        case AppConst.literID: return liteIcon;
        case AppConst.literIDTHCS: return liteIcon;

        case AppConst.hisID: return historyIcon;
        case AppConst.hisTHID: return historyIcon;

        case AppConst.geoID: return geoIcon;
        case AppConst.geoTHID: return geoIcon;

        case AppConst.engID: return enIcon;
        case AppConst.engTHPTID: return enIcon3;
        case AppConst.engTHPT2: return enIcon3;
        case AppConst.engTHPT3: return enIcon10;
        case AppConst.engGRM: return enIcon;
        case AppConst.engTHCS: return enIcon2;

        case AppConst.gdcdID: return gdcdIcon;
        case AppConst.gdcdTHID: return gdcdIcon;
        default:
            return mathImageHeader;
    }
};

module.exports = {
    getIconSubject,
    getImageHeaderSubject,
    getImageTeacher,
    checkIsNullWithZero
}