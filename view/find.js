$(document).ready(function(){
    /**
     * This method will be reused everytime a new event happens in this tab.
     * If there's data to be showed, it will fill the form values,
     * otherwise it will clean it. 
     * It will mainly clean if the user searches for a user that does not 
     * exists
     * @param {*} data 
     */
    function fillFindContainer(data){
        if (data){
            $("#find-name").val(data.name);
            $("#find-email").val(data.email);
            $("#find-telephone").val(data.tel);
            $("#find-address").val(data.address);
            $("#find-provider").val(data.provider);
            $("#find-lat").val(data.lat);
            $("#find-lon").val(data.lng);
                                         
        }else{
            $("#find-name").val("");
            $("#find-email").val("");
            $("#find-telephone").val("");
            $("#find-address").val("");
            $("#find-provider").val("");
            $("#find-lat").val("");
            $("#find-lon").val("");
           
        }      
    }
    /**
     * This is an aux function to assemble the object contact.
     * It will be used mainly to the update function
     */
    function assembleContact(){
        let c = {};
        c.name = $("#find-name").val();
        c.email = $("#find-email").val();
        c.tel = $("#find-telephone").val();
        c.address = $("#find-address").val();
        return c;
    }
    /**
     * This function binds an event to the find contact button.
     */
    $("#btn-find-contact").click(function(event){
        event.preventDefault();
        let contact_name = $("#find-name-search").val();
        $.ajax({
            url: '/landlords/'+contact_name,
            type: 'GET',
            contentType: 'application/json',                        
            success: function(response){
                console.log(response);
                $("#find-out").text(response.msg);
                fillFindContainer(response.data);              
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });
    /**
     * This function will bind an event to the update button.
     */
    $("#btn-update-contact").click(function(event){
        event.preventDefault();
        let contact_name = $("#find-name-search").val();
        let contact = assembleContact();
        $.ajax({
            url: '/landlords/'+contact_name,
            type: 'PUT',
            data: JSON.stringify(contact),
            contentType: 'application/json',                        
            success: function(response){
                console.log(response);
                $("#update-delete-out").text(response.msg);                
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });
    /**
     * This function will bind an event to the delete button
     */
    $("#btn-delete-contact").click(function(event){
        event.preventDefault();
        let contact_name = $("#find-name-search").val();
        $.ajax({
            url: '/landlords/'+contact_name,
            type: 'DELETE',
            contentType: 'application/json',                        
            success: function(response){
                // console.log(JSON.stringify(response));
                console.log(response);
                $("#update-delete-out").text(response.msg);
                // We clear the fields after the data is deleted
                fillFindContainer(null);              
            },                   
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    });
});