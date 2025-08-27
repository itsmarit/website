document.addEventListener("DOMContentLoaded", function() { // when HTML has loaded
  
  // elements
  var buttons = document.querySelectorAll("#nav-projects button");
  var projects = document.querySelectorAll("#projects img");
  var blogSection = document.getElementById("blog");
  var projectsSection = document.getElementById("projects");
  var blogButton = document.getElementById("show-blog");
  var closeButton = document.getElementById("close-button");
  var modal = document.getElementById("modal-back");
  var modalContent = modal.querySelector(".modal");
  var params = new URLSearchParams(window.location.search);
  var backToBlog = params.get("blog");
  
  // first check if user has clicked a 'back to blog' button on a post page
  if (window.location.hash === "#blog") {
    showBlog();
  }  
  
  // go through all buttons for filtering
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function() {
      var filter = this.getAttribute("data-filter"); // user's chosen filter
	  
      // mark the clicked button as active, and others as inactive
      for (var k = 0; k < buttons.length; k++) {
        buttons[k].classList.remove("active");
      }
	  blogButton.classList.remove("active");
      this.classList.add("active");
	  
      // show projects section and hide blog section
      projectsSection.style.display = "block";
      blogSection.style.display = "none";

      // go through all the projects
      for (var j = 0; j < projects.length; j++) {
        var project = projects[j];
        var category = project.getAttribute("data-category");

        // filtering
        if (filter == "all" || category.indexOf(filter) !== -1) { // if the chosen filter is 'all' or if the project belongs to the chosen category
          project.style.visibility = "visible";
          project.style.position = "static";
          project.style.height = "auto";
          project.style.marginBottom = "1rem";
        } else {
          project.style.visibility = "hidden";
          project.style.position = "absolute";
          project.style.height = "0";
          project.style.marginBottom = "0";
          project.style.overflow = "hidden";
        }
      }
    });
  }

  // user wants to see the blog -> hide the projects and show the blog
  blogButton.addEventListener("click", showBlog);
  
  function showBlog() {
    blogSection.style.display = "block";
    projectsSection.style.display = "none";
	
	// mark the blog button as active, others as inactive
      for (var k = 0; k < buttons.length; k++) {
        buttons[k].classList.remove("active");
      }
      blogButton.classList.add("active");
  }
  
  // click on project -> change the modal's content to display the relevant info
  for (var l = 0; l < projects.length; l++) {
    projects[l].addEventListener("click", function() {
		
	  var file = this.getAttribute("data-file");
	  
	  fetch(file) // read data from the project's file (projects are stored in separate files)
	    .then(function(fileText) {
		  return fileText.text();
		})
		.then(function(html) {
		  modalContent.innerHTML = html; // change the modal's content
		  
		  closeButton = document.getElementById("close-button"); // button to close the project
		  closeButton.addEventListener("click", function() {
			modal.style.display = "none";
		  });
		  
		  // slides (if a project has multiple images)
		  var slides = document.querySelectorAll(".modal img");
		  var slideIndex = 1; // initial slide index (first picture)
		  
		  if(slides.length < 2) { // if the project only has one image
			showSlide(1);
		  } else { // multiple images
		    
			var previous = document.querySelector(".previous");
			var next = document.querySelector(".next");
			showSlide(slideIndex);
			  
			previous.onclick = function() {
			  slideIndex -= 1;
			  slideIndex = showSlide(slideIndex);
			}
			  
			next.onclick = function() {
			  slideIndex += 1;
			  slideIndex = showSlide(slideIndex);
			}
		  };
		  
		  // displaying the slide
		  function showSlide(n) {
			if (n > slides.length) { // go back to beginning
			  slideIndex = 1;
			} else if (n < 1) { // go to end
			  slideIndex = slides.length;
			} else {
			  slideIndex = n;
			}
			for (var m = 0; m < slides.length; m++) { // hide all slides
			  slides[m].style.display = "none";
			}
			slides[slideIndex-1].style.display = "inline-block"; // display the current slide
			
			slides[slideIndex-1].onclick = function() { // user clicks on image -> open the image in a new tab
			  var url = slides[slideIndex-1].getAttribute("src");
			  window.open(url, "_blank");
			}
		  
			return slideIndex;
		  }
		  
	      modal.style.display = "flex";
	      window.onclick = function(event) { // user clicks outside the modal -> close it
		    if (event.target == modal) {
			  modal.style.display = "none";
		    }
		  }
		});
    });
  }
  
});
