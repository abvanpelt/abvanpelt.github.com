const keys = document.querySelectorAll(".key");
keys.forEach(key => 
    key.addEventListener(
        "click", 
        function() { console.log("Clicked: " + key.id) }
    )
);