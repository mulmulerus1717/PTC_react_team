import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"


const TriggerToastify = (message,color) => {
    let colorAdd = "#172b4d";
    if(color === 'success'){
        colorAdd = "rgb(54, 179, 126)";
    }else if(color === 'error'){
        colorAdd = "rgb(255, 86, 48)";
    }else if(color === 'warning'){
        colorAdd = "rgb(255, 171, 0)";
    }else if(color === 'info'){
        colorAdd = "rgb(38, 132, 255)";
    }
    Toastify({
        text: message,
        duration: 4000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: colorAdd,
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

export default TriggerToastify;