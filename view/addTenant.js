$(document).ready(function(){
    /**
     * This function will get all the values in the inputs
     * and will create a valid object to be send to the server-side
     */
    function assembleContact(){
        let c = {};
        c.name = $("#add-name").val();
        c.email = $("#add-email").val();
        c.tel = $("#add-telephone").val();
        c.address = $("#add-address").val();
        return c;
    }
    /**
     * This function binds an event to the add button.
     * The idea is that we assemble a valid object from the form
     * and send it to the server-side.
     */
    $("#add-contact-btn").click(function(event){
        event.preventDefault();
        let contact = assembleContact();
        $.ajax({
            url: '/tenants',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(contact),
            success: function(response){
                // We can print in the front-end console to verify
                // what is coming back from the server side
                console.log(JSON.stringify(response));
                $("#add-out").text(response);
            },        
            //We can use the alert box to show if there's an error in the server-side
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });

    


});