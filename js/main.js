let moodSliderState = {
    mood1: null,
    mood2: null,
    mood3: null,
    mood4: null
}


class Programmes {
    constructor() {
        this.programmes = [];
    }

    //Takes data from XML file and selects the name, image and mood values
    filterXML(xmlProgrammes) {
        var that = this;
        $(xmlProgrammes).find('programme').each(function () {
            var $programme = $(this);
            var name = $programme.find("name").text();
            var image = $programme.find("image").text();
            var mood = $programme.find("mood").text();

            let programme = {
                name: name,
                image: image,
                mood: mood
            };

            that.programmes.push(programme)
        });
        this.updateRecommendations();
    }

    //This function updates the programme recommendations based on the slider values
    updateRecommendations() {
        let selectedMoods = Object.values(moodSliderState)
            .filter(mood => mood !== null);

            //If statement checks if sliders have been moved, if length is 0 this means it has not been changed, if false, sliders have been changed
        if (selectedMoods.length == 0) {
            // Return random selection of movies
            for (let i = 0; i < 5; i++) {
                let randInd = Math.floor(Math.random() * this.programmes.length);
                let { name, image } = this.programmes[randInd];

                let imgContainer = document.querySelectorAll('.img-container')[i];
                imgContainer.innerHTML = `<img src="${image}" />`
                document.querySelectorAll('.recommendation > p')[i].textContent = name;
            }

        } else {
          //Return selection of movies based on recommendation from sliders
            var filteredProgrammes = this.programmes.filter(programme => {
                return selectedMoods.includes(programme.mood.toLowerCase())
            });
            for (let i = 4; i >= 0; i--) {
                let randInd = Math.floor(Math.random() * filteredProgrammes.length);
                let { name, image } = filteredProgrammes[randInd];

                let imgContainer = document.querySelectorAll('.img-container')[i];
                imgContainer.innerHTML = `<img src="${image}" />`
                document.querySelectorAll('.recommendation > p')[i].textContent = name;

                filteredProgrammes.splice(i, 1);
            }
        }
    }

}

//create object of Programmes class
let myProgrammes = new Programmes();

//boolean variable to check if file has been uploaded, set to false
let uploaded = false;

[...document.querySelectorAll('input.slider')].forEach(slider => [
    slider.addEventListener('change', event => {

      //if statement checks if a file has been uploaded, if it has then the values of the sliders are taken and recommendations are displayed
      if(uploaded) {
          let target = event.target;
          let currentMood = target.getAttribute('data-mood');
          if (target.value > 50) {
              moodSliderState[currentMood] = target.getAttribute('data-positive');
          } else if (target.value < 50) {
              moodSliderState[currentMood] = target.getAttribute('data-negative');
          } else {
              moodSliderState[currentMood] = null;
          }

          myProgrammes.updateRecommendations();
      }
      else {
        //file has not been uploaded, reset sliders to normal
        alert("Please upload an XML file of the content.");
        let target = event.target;
        target.value = 50;
      }
    })
])

//Reads data from XML file which has been uploaded
document.querySelector('input[type="file"]').addEventListener('change', event => {
  uploaded = true;
    var file = event.target.files;
    var fileReader = new FileReader();
    fileReader.readAsText(file[0]);

    fileReader.addEventListener('load', function () {
        var xml = new DOMParser()
            .parseFromString(this.result, "text/xml");

        myProgrammes.filterXML(xml.documentElement);
    });
})
