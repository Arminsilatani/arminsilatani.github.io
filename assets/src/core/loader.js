/* :::::::::::::::::::::::::: SCRIPTS & ANALYTICS :::::::::::::::::::::::::: */

(function() {
    function hideLoader() {
        var loader = document.getElementById('initial-loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(hideLoader, 300);
        });
    } else {
        setTimeout(hideLoader, 300);
    }

    setTimeout(hideLoader, 2500);

})();