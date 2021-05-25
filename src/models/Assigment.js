const getAssigmentStatus = (status) => {
    switch (status) {
        case 0: return '(Chưa làm)';
        case 2: return '(Đang làm)';
        case 4: return '(Đã làm xong)';
        case 6: return '(Chờ chấm điểm)'
        default:
            return '';
    }
}

export { getAssigmentStatus };