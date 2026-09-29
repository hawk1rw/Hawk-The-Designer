/* =====================================================
   SUPABASE CONFIGURATION
   ===================================================== */

const SUPABASE_URL = "https://cerruqzssdfxtqjfmftv.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcnJ1cXpzc2RmeHRxamZtZnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2OTA1NDUsImV4cCI6MjEwNjI2NjU0NX0.zX-7d4-LT4LbYpSmC_1Ey6OlCJcWa34egzdH5OLYa0g";


/* Create Supabase client */

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


/* =====================================================
   PORTFOLIO CONFIGURATION
   ===================================================== */

const BUCKET_NAME = "portfolio";

const portfolioGallery =
    document.getElementById("portfolio-gallery");


/* =====================================================
   GET PUBLIC FILE URL
   ===================================================== */

function getPublicUrl(path) {

    const { data } =
        supabaseClient.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return data.publicUrl;
}


/* =====================================================
   LOAD PORTFOLIO
   ===================================================== */

async function loadPortfolio() {

    if (!portfolioGallery) {
        return;
    }

    portfolioGallery.innerHTML = `
        <div class="portfolio-loading">
            Loading my work...
        </div>
    `;


    try {

        const categories = [
            {
                name: "logos",
                title: "Logo Design"
            },

            {
                name: "flyers",
                title: "Flyer & Poster"
            },

            {
                name: "banners",
                title: "Banner Design"
            },

            {
                name: "videos",
                title: "Video Intro"
            }
        ];


        let projects = [];


        /* Load every category */

        for (const category of categories) {

            const { data, error } =
                await supabaseClient
                .storage
                .from(BUCKET_NAME)
                .list(category.name, {
                    limit: 100,
                    sortBy: {
                        column: "name",
                        order: "asc"
                    }
                });


            if (error) {

                console.error(
                    `Error loading ${category.name}:`,
                    error
                );

                continue;
            }


            if (!data) {
                continue;
            }


            data.forEach(file => {

                /*
                 * Ignore folders
                 */

                if (!file.name) {
                    return;
                }


                const extension =
                    file.name
                    .split(".")
                    .pop()
                    .toLowerCase();


                const imageExtensions = [
                    "jpg",
                    "jpeg",
                    "png",
                    "webp",
                    "gif"
                ];


                const videoExtensions = [
                    "mp4",
                    "webm",
                    "mov"
                ];


                let type = null;


                if (
                    imageExtensions
                    .includes(extension)
                ) {

                    type = "image";

                } else if (
                    videoExtensions
                    .includes(extension)
                ) {

                    type = "video";
                }


                if (!type) {
                    return;
                }


                projects.push({

                    name: file.name,

                    category: category.name,

                    title: category.title,

                    type: type,

                    path:
                        `${category.name}/${file.name}`

                });

            });

        }


        renderPortfolio(projects);


    } catch (error) {

        console.error(
            "Portfolio loading error:",
            error
        );


        portfolioGallery.innerHTML = `
            <div class="portfolio-error">
                Unable to load portfolio.
            </div>
        `;

    }

}


/* =====================================================
   RENDER PORTFOLIO
   ===================================================== */

function renderPortfolio(projects) {

    if (!portfolioGallery) {
        return;
    }


    if (!projects.length) {

        portfolioGallery.innerHTML = `
            <div class="portfolio-empty">
                No portfolio projects found.
            </div>
        `;

        return;
    }


    portfolioGallery.innerHTML =
        projects.map(project => {

            const url =
                getPublicUrl(project.path);


            const safeName =
                project.name
                .replace(/\.[^/.]+$/, "")
                .replace(/[-_]/g, " ");


            if (project.type === "video") {

                return `

                    <article
                        class="project"
                        data-category="${project.category}"
                    >

                        <div class="project-image">

                            <video
                                controls
                                muted
                                playsinline
                                preload="metadata"
                            >

                                <source
                                    src="${url}"
                                    type="video/mp4"
                                >

                                Your browser does not
                                support video.

                            </video>

                        </div>


                        <div class="project-info">

                            <span>
                                ${project.title}
                            </span>

                            <h3>
                                ${safeName}
                            </h3>

                        </div>

                    </article>

                `;

            }


            return `

                <article
                    class="project"
                    data-category="${project.category}"
                >

                    <div class="project-image">

                        <img
                            src="${url}"
                            alt="${safeName}"
                            loading="lazy"
                        >

                    </div>


                    <div class="project-info">

                        <span>
                            ${project.title}
                        </span>

                        <h3>
                            ${safeName}
                        </h3>

                    </div>

                </article>

            `;

        }).join("");


    setupPortfolioFilters();

}


/* =====================================================
   PORTFOLIO FILTERS
   ===================================================== */

function setupPortfolioFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    const projects =
        document.querySelectorAll(
            ".project"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const filter =
                    button.dataset.filter;


                /* Active button */

                buttons.forEach(btn => {
                    btn.classList.remove("active");
                });


                button.classList.add("active");


                /* Filter projects */

                projects.forEach(project => {

                    const category =
                        project.dataset.category;


                    if (
                        filter === "all" ||
                        category === filter
                    ) {

                        project.style.display =
                            "";

                    } else {

                        project.style.display =
                            "none";
                    }

                });

            }
        );

    });

}


/* =====================================================
   MOBILE MENU
   ===================================================== */

const menuBtn =
    document.querySelector(".menu-btn");

const nav =
    document.querySelector(".nav-links");


if (menuBtn && nav) {

    menuBtn.addEventListener(
        "click",
        () => {

            nav.classList.toggle("open");

        }
    );


    nav.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    nav.classList.remove("open");

                }
            );

        });


    document.addEventListener(
        "click",
        event => {

            if (
                !nav.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {

                nav.classList.remove("open");

            }

        }
    );

}


/* =====================================================
   START
   ===================================================== */

loadPortfolio();
