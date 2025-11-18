const smartPosition = (rect: DOMRect) => {
    const margin = 8;
    const buttonWidth = 90;
    const buttonHeight = 30;

    let x = (rect.left + rect.right) / 2 + window.scrollX - buttonWidth / 2;
    let y = rect.bottom + window.scrollY + margin;

    const viewportLeft = window.scrollX;
    const viewportTop = window.scrollY;
    const viewportRight = window.innerWidth + window.scrollX;
    const viewportBottom = window.innerHeight + window.scrollY;

    // ===== XỬ LÝ MÉP PHẢI =====
    if (x + buttonWidth > viewportRight) {
        x = rect.left + window.scrollX - buttonWidth;
    }

    // ===== XỬ LÝ MÉP TRÁI =====
    if (x < viewportLeft) {
        // không thể đặt bên trái → đặt sát trái viewport luôn
        x = viewportLeft + margin;
    }

    // ===== XỬ LÝ MÉP DƯỚI =====
    if (y + buttonHeight > viewportBottom) {
        y = rect.top + window.scrollY - buttonHeight - margin;
    }

    // ===== XỬ LÝ MÉP TRÊN =====
    if (y < viewportTop) {
        // không thể đưa lên trên → đặt sát mép dưới selection
        y = rect.bottom + window.scrollY + margin;
    }

    return { x, y };
};

export default smartPosition;
