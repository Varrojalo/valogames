const sideBar = document.querySelector("#sidenav-bar");
const closeBtn = document.querySelector("#close-button");
const menuBtn = document.querySelector("#menu-icon");


closeBtn.addEventListener('click', () => {
    if(sideBar.classList.contains('show-sidebar'))
    {
        sideBar.classList.remove('show-sidebar');
    }
    else
    {
        return;
    }
});

menuBtn.addEventListener('click', () => {
    
    if(sideBar.classList.contains("show-sidebar"))
    {
        return;
    }
    else
    {
        sideBar.classList.add('show-sidebar');
    }
    
});