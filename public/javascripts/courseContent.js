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

  if(query.has('result')){
    try {
      let response = await fetch(`/examen/result/${query.get('test')}`,{
        method : 'POST'
      });
      let result = await response.json();
      console.log(result)
      
    } catch (error) {
      console.error
    }
  }


})