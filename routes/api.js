var express =require('express');

var router=express.Router();

var conn=[];


// Functions


var checkConnId = function(id,callback){

	if(!conn.length)
	{
		callback('No');
		return ;
	}

	for(var i=0;i<conn.length;i++)
	{
		if(conn[i].ConnId===id)
		{
			callback('Yes');
			return;
		}
	}


	callback('No');

}

var removeConn=function(id,callback){

	for(var i=0;i<conn.length;i++)
	{
		if(conn[i].ConnId===id)
		{
			conn.splice(i,1);           // removes 1 element at position i
			callback('Done');
			return;
		}
	}
}

var getStatus = function(callback){
	var data=[];

	var d= new Date();
	var n=parseInt(d.getTime());

	if(!conn.length)
	{
		callback('No connection in server.');
		return;
	}



	for(var i=0;i<conn.length;i++)
	{
		var time_left=conn[i].f_time-n;

		var obj={
			id: conn[i].ConnId,
			t_left: time_left
		}

		data.push(obj);

	}

	callback(data);
	return;
}

var killcon= function(id,callback){

	
	for(var i=0;i<conn.length;i++)
	{
		if(conn[i].ConnId===id)
		{
			
            callback("Status: killed");
			removeConn(id,function(data){
				if(data==='Done')
				{
					
					return;
				}

			});

			
			
			
		}
	}

	callback('Status: invalid connection id:'+id);

}


// end of Functions


// Routes 


router.get('/request',function(req,res,next){

	var id=parseInt(req.query.connId);
	var time=parseInt(req.query.timeout);

	checkConnId(id,function(flag){

		if(flag==='No')
		{
			var date=new Date();
			var n=parseInt(date.getTime());
			var start_time=n;
			var finish_time=n=time;

			var new_conn={
				ConnId: id,
				s_time: start_time,
				f_time: finish_time,
				status: 'Running'
			}
			conn.push(new_conn);

			setTimeout(function(){

				

				removeConn(id,function(flag){

					if(flag==='Done')
					res.send('OK');

				});

			},time);


		}

		else
		{
			res.send('Connection id: '+ id+' is already present.');
		}

	});

});

router.get('/serverStatus',function(req,res,next){

	getStatus(function(data){

		res.send(data);
	});

});

router.get('/kill/:id',function(req,res,next){

	var cid=req.params.id;
      

	killcon(cid,function(data){
		res.send(data);
	});


});

module.exports=router;
