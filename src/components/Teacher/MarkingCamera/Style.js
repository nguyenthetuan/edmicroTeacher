export const Style = `
<style type="text/css">
	html, body{
		padding:0px;
		margin:0px;
		overflow-x: hidden;
	}
	.inline-block{
		display: inline-block;
	}
	.flex{
		flex:1;
	}
	.hide{
		display: none;
	}
	.btn-circle{
		display: inline-block;
		width:32px;
		height: 32px;
		background: #dc3545;
		border-radius: 16px;
		text-align: center;
	}
	.group{
		margin-bottom: 40px;
	}
	.top-section{
		display: flex;
		background: #343a40;
		padding:8px;
	}
	.center-vertical{
		vertical-align: middle;top: 50%;
		transform: translateY(50%);
	}
	.abs-center{
		position: absolute;
		top: 50%;
		left: 50%;
		margin-right: -50%;
		transform: translate(-50%, -50%)
	}
	.btn-edit{
		color: #fff;
		width:50px;
		border-radius: 5px;
		background: #dc3545;
		text-align: center;
		font-size: 14px;
		display: flex;
		text-align: center;
		position: relative;
	}
	.box-action{
		align-self: center;
	}
	.icon{
		color:#fafafa;
		font-size: 14px
	}
	.btn-cancel{
		background: #6c757d;
		padding: 10px 10px;
		border-radius: 5px;
		color: #fff;
		font-size: 14px;
	}
	.btn-save{
		background: #007bff;
		padding: 10px 10px;
		border-radius: 5px;
		color: #fff;
		font-size: 14px;
	}

	.box-score{
		height: 60px;
		border-radius: 5px;
		position: relative;
		text-align: center;
	}
	.input-score{
		border: none;
		position: absolute;
		transform: translate(-50%, -50%);
		text-align: center;
		font-size: 60px;
		outline: 0px;
		font-weight: bold;
		color:red;
	}
	.text-score{
		position: absolute;
		top: -8px;
		font-size: 16px;
		font-weight: bold;
		color:#2f63c2;
		padding:0px 10px;
		background: #fff;
		transform: translateX(-50%);
	}
	.correct{
		color:#56BB73;
		margin-right: 20px;
	}
	.incorrect{
		color: #FF6213;
	}
	.x-panel{
		color:#4776AD;
		font-weight:bold;
		font-size: 16px;
		padding:0px 10px;
	}
	.comment-container{
		background: rgba(45, 156, 219, 0.2);
		box-sizing: border-box;
		padding: 10px 10px;
	}
	.box-comment{
		min-height: 80px;
		border-radius: 5px;
		position: relative;
		background: #fff;
	}
	.input-comment{
		background: #fff;
		border: none;
		font-size: 16px;
		color: red;
		width: 100%;
		max-width: 100%;
		min-height: 80px;
		align-content:left;
		overflow:auto; 
		box-sizing: border-box;
		outline: none;
		padding: 10px 20px;
	}
	.text-warning{
		margin: 0px 10px;
		color:#007bff;
	}
	.btn-submit{
		background: #31C0FC;
		padding: 15px 20px;
		color: #fff;
		text-align: center;
		border-radius: 5px;
		margin-vertial: 20px;
		margin: 10px 10px;
	}
</style>
`;