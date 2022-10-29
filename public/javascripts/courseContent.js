const modifyProgress = async (courseId) => {
  try {
      let response = await fetch(`/videos/getviewedbyuser/${courseId}`);
      let result = await response.json();
      
      const {data} = result;
      let percentage = Math.floor(data.videosViewed.length * 100 / data.total)

      document.getElementById('showProgress').style.width = `${percentage}%`
      document.getElementById('showProgress').innerHTML = `${percentage}%`
  } catch (error) {
    console.error
  }
}

const showVideo = async (event,videoId,userId, courseId) => {
  event.preventDefault();
  try {
    let response = await fetch('/videos/geturl/' + videoId, {
      method : 'POST'
    });
    let result = await response.json();
    if(result.ok){
      document.getElementById('showVideo').src = result.url;
      document.getElementById('showVideo').play();
      document.getElementById('videoCheck' + videoId).checked = true;
      
      response = await fetch(`/videos/seenbyuser/${userId}/${videoId}`,{
        method : 'POST'
      });
      result = await response.json();
      console.log(result);

      modifyProgress(courseId)

    }
   
  } catch (error) {
    console.error
  }
 
}

const seedByUser = async ({target},userId,videoId,courseId) => {
  try {
    if(!target.checked){
      let response = await fetch(`/videos/notseenbyuser/${userId}/${videoId}`, {
        method : 'DELETE',
      })
      let result = await response.json();
      console.log(result)
      modifyProgress(courseId)

    }else {
      let response = await fetch(`/videos/seenbyuser/${userId}/${videoId}`, {
        method : 'POST',
      })
      let result = await response.json();
      console.log(result)
      modifyProgress(courseId)

    }
  } catch (error) {
    console.error
  }
}

window.addEventListener('load', async () => {

  const query = new URLSearchParams(location.search);

  if(query.has('test')){
    document.getElementById('btn-test' + query.get('test')).click();
  }


})

const showImage = (id) => {
  document.getElementById('box-question' + id).classList.add('justify-content-center');
  document.getElementById('title' + id).hidden = true;
  document.getElementById('box-image' + id).hidden = false;
  document.getElementById('btn-show-image' + id).hidden = true;
  
};

 const hiddenImage= (id) => {
  document.getElementById('box-question' + id).classList.remove('justify-content-center');
  document.getElementById('title' + id).hidden = false;
  document.getElementById('box-image' + id).hidden = true;
  document.getElementById('btn-show-image' + id).hidden = false;

}

const showImageAnswer = (id) => {
  document.getElementById('box-answer' + id).classList.remove('d-flex');
  //document.getElementById('title-answer' + id).hidden = true;
  document.getElementById('box-image-answer' + id).hidden = false;
  document.getElementById('btn-show-image-answer' + id).hidden = true;
  
};

 const hiddenImageAnswer= (id) => {
  document.getElementById('box-answer' + id).classList.add('d-flex');
  //document.getElementById('title-answer' + id).hidden = false;
  document.getElementById('box-image-answer' + id).hidden = true;
  document.getElementById('btn-show-image-answer' + id).hidden = false;

}