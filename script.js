
/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".navbar nav");

menuBtn.addEventListener("click", () => {
    nav.classList.toggle("open");
});


/* Close mobile menu when a link is clicked */

const navLinks = document.querySelectorAll(".navbar nav a");

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        nav.classList.remove("open");

    });

});


/* =========================================
   PORTFOLIO FILTER
========================================= */

const filters = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");


filters.forEach((button) => {

    button.addEventListener("click", () => {

        /* Remove active state */

        filters.forEach((btn) => {
            btn.classList.remove("active");
        });


        /* Add active state */

        button.classList.add("active");


        /* Get selected category */

        const selectedCategory = button.dataset.filter;


        /* Show / hide projects */

        projects.forEach((project) => {

            const projectCategory = project.dataset.category;


            if (
                selectedCategory === "all" ||
                projectCategory === selectedCategory
            ) {

                project.style.display = "block";

            } else {

                project.style.display = "none";

            }

        });

    });

});


/* =========================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
========================================= */

document.addEventListener("click", (event) => {

    const clickedInsideMenu =
        nav.contains(event.target) ||
        menuBtn.contains(event.target);


    if (!clickedInsideMenu) {

        nav.classList.remove("open");

    }

});


/* =========================================
   ESC KEY
========================================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        nav.classList.remove("open");

    }

});

