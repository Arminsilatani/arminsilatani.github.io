/*
  ****************************************************
  *  Author: Armin Silatani
  *  Date: 2026-05-19
  *  Version: 1.0.0
  ****************************************************
*/

/* ------------------------- BREADCRUMB ANIMATION ------------------------- */
(function initBreadcrumb() {
    const container = document.getElementById("terminalPath");
    if (!container) return;

    const domain = window.location.hostname;
    const parts = window.location.pathname.split("/").filter(Boolean);
    const paths = [{ name: domain, url: "/" }];

    let fullPath = "";
    parts.forEach(function (part) {
        fullPath += "/" + part;
        paths.push({ name: part, url: fullPath });
    });

    let textIndex = 0;
    let charIndex = 0;

    function typeSegment() {
        if (textIndex >= paths.length) return;

        const segment = paths[textIndex];
        const link = document.createElement("a");
        link.href = segment.url;
        container.appendChild(link);

        function typeChar() {
            if (charIndex < segment.name.length) {
                link.textContent += segment.name.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 40);
            } else {
                charIndex = 0;
                textIndex++;
                if (textIndex < paths.length) {
                    container.appendChild(document.createTextNode("/"));
                }
                setTimeout(typeSegment, 100);
            }
        }

        typeChar();
    }

    typeSegment();
})();