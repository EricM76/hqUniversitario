const $ = e => document.getElementById(e)

const resetModal = async (id, mp_id) => {
    
    $('form-editMembership' + id).classList.remove('was-validated');

   /*  try {

        let response = await fetch('/memberships/get-plan-subscription/' + mp_id);
        let result = await response.json();
        console.log(result.data);
        if(result){
            const {reason, back_url} = result.data;
            const {frequency,transaction_amount,repetitions,billing_day,billing_day_proportional} = result.data.auto_recurring;
            $('billing_day_proportional'+id).checked = billing_day_proportional;
            $('reason' + id).value = reason;
            $('back_url'+id).value = back_url;
            $('transaction_amount' + id).value = transaction_amount;
            $('billing_day' + id).value = billing_day;
            $('repetitions'+id).value = repetitions
            $('frequency'+id).value = frequency;
        }
    
       
    } catch (error) {
        console.error
    } */

}