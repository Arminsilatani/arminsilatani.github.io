/* :::::::::::::::::::::::::: PROCESS GRID INTERACTION :::::::::::::::::::::::::: */
(function() {
    const grid = document.getElementById('processGrid');
    if (!grid) return;

    const boxes = grid.querySelectorAll('.process-box');

    boxes.forEach(box => {
        box.addEventListener('mouseenter', function() {
            if (this.classList.contains('is-open')) return;

            boxes.forEach(b => b.classList.remove('is-open'));

            this.classList.add('is-open');
        });
    });
})();
