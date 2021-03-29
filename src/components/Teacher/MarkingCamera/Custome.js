export const CustomeJs = `
<script type="text/javascript">
    
var btnEdits  = $('.btnEdit');
var btnOptions  = $('.btnOptions');

function onEdit(i){
	$('#btn-edit-'+i).hide();
	$('#btn-rotate-'+i).hide();
	$('#action-'+i).show();
	$('#btn-options-'+i).show();
}

function onCancel(i){
	$('#btn-edit-'+i).show();
	$('#btn-rotate-'+i).show();
	$('#action-'+i).hide();
	$('#btn-options-'+i).hide();
}

function onSave(i){
	$('#btn-edit-'+i).show();
	$('#btn-rotate-'+i).show();
	$('#action-'+i).hide();
	$('#btn-options-'+i).hide();
}

</script>

`;