//cuantas veces se ha ejecutado la funcion upDate().
var indice_frame=0;
//clases
//matriz en la que se guardan todos los objetos
var objetos = new Array();
//definición de la clase de los objetos
function SolidoDinamico (x_inicial,y_inicial,aceleracion_x,aceleracion_y,velocidad_inicial_x,velocidad_inicial_y,masa,material)
{
this.x_inicial				= x_inicial;
this.y_inicial				= y_inicial;
this.x;
this.y;
this.x_anterior;
this.y_anterior;
this.ancho				= tamano;
this.alto				= tamano;
this.aceleracion_x			= aceleracion_x;
this.aceleracion_y			= aceleracion_y;
this.velocidad_inicial_x		= velocidad_inicial_x;
this.velocidad_inicial_y		= velocidad_inicial_y;
this.velocidad_actual_x;
this.velocidad_actual_y;
this.tiempo_inicial_x			= indice_frame;
this.tiempo_inicial_y			= indice_frame;
this.masa				= masa;
this.material 				= material;
this.mascara 				= document.createElement('img');
this.mascara.setAttribute('style', "position:absolute;background-color:white;");
switch (material){
	case 0:
		this.mascara.setAttribute('src', 'img/acero.jpg');
		break;
	case 1:
		this.mascara.setAttribute('src', 'img/aluminio.jpg');
		break;
	case 2:
		this.mascara.setAttribute('src', 'img/laton.jpg');
		break;
	default:
		this.mascara.setAttribute('src', 'img/no-img.png');
};
zona.appendChild(this.mascara);
this.mascara.style.width=this.ancho;
this.mascara.style.height=this.alto;
}
//funciones
//calcula tiempo que ha transcurrido desde el principio hasta idx. idx es el numero de veces que se ha ejecutado la función upDate()
function get_time(idx){
return idx*frame;
};
//funciones que calculan la nueva posición de objeto
//	horizontal
function movimiento_x (objeto)
{
objeto.x_anterior=objeto.x;
objeto.tiempo_actual= indice_frame;
objeto.x=objeto.x_inicial+objeto.velocidad_inicial_x*((get_time(indice_frame)-get_time(objeto.tiempo_inicial_x))/1000)+0.5*(aceleracion_amb_x+objeto.aceleracion_x)*((get_time(indice_frame)-get_time(objeto.tiempo_inicial_x))/1000)*((get_time(indice_frame)-get_time(objeto.tiempo_inicial_x))/1000);
};
//	vertical
function movimiento_y (objeto)
{
objeto.y_anterior=objeto.y;
objeto.tiempo_actual= indice_frame;
objeto.y=objeto.y_inicial+objeto.velocidad_inicial_y*((get_time(indice_frame)-get_time(objeto.tiempo_inicial_y))/1000)+0.5*(aceleracion_amb_y+objeto.aceleracion_y)*((get_time(indice_frame)-get_time(objeto.tiempo_inicial_y))/1000)*((get_time(indice_frame)-get_time(objeto.tiempo_inicial_y))/1000);
};
//calcula la velocidad a la que va obj en el momento en el que se ejecuta la función
//	horizontal
function calc_velocidad_actual_x (obj){
return(obj.x-obj.x_anterior)/(frame/1000);
};
//	 vertical
function calc_velocidad_actual_y (obj){
return(obj.y-obj.y_anterior)/(frame/1000);
};
//comprueba si objeto esta chocando con el borde de zona.
function check_colision_zona (objeto)
{
if (zona.height < objeto.y*escala+objeto.alto){
friccion_x(objeto,0);
objeto.velocidad_inicial_y=-(calc_velocidad_actual_y(objeto))*coeficientes[0][objeto.material][3];
objeto.y=(zona.height-objeto.alto)/escala;
objeto.y_inicial=objeto.y;
objeto.tiempo_inicial_y=indice_frame;
};
if (0 > objeto.y*escala){
friccion_x(objeto,0);
objeto.velocidad_inicial_y=-(calc_velocidad_actual_y(objeto))*coeficientes[0][objeto.material][3];
objeto.y=0;
objeto.y_inicial=objeto.y;
objeto.tiempo_inicial_y=indice_frame;
};
if (0 > objeto.x*escala){
friccion_y(objeto,0);
objeto.velocidad_inicial_x=-(calc_velocidad_actual_x(objeto))*coeficientes[0][objeto.material][3];
objeto.x=0;
objeto.x_inicial=objeto.x;
objeto.tiempo_inicial_x=indice_frame;
};
if (zona.width < objeto.x*escala+objeto.ancho){
friccion_y(objeto,0);
objeto.velocidad_inicial_x=-(calc_velocidad_actual_x(objeto))*coeficientes[0][objeto.material][3];
objeto.x=(zona.width-objeto.ancho)/escala;
objeto.x_inicial=objeto.x;
objeto.tiempo_inicial_x=indice_frame;
};
};
//comprueba si obj1 y obj2 se están chocando
function check_colision (obj1, obj2) {
if (obj1.x + (obj1.ancho)/escala < obj2.x) {
return false;
}
if (obj1.y + (obj1.alto)/escala < obj2.y) {
return false;
}
if (obj1.x > obj2.x + (obj2.ancho)/escala) {
return false;
}
if (obj1.y > obj2.y + (obj2.alto)/escala) {
return false;
}
return true;
};
//determina de que lado chocan los objetos obj1 y obj2
function lado_colision (obj1, obj2) {
var dist_h=obj1.x_anterior-obj2.x_anterior;
var dist_v=obj1.y_anterior-obj2.y_anterior;
var angulo=(Math.asin(Math.abs(dist_v)/(Math.sqrt((Math.abs(dist_v)*Math.abs(dist_v))+(Math.abs(dist_h)*Math.abs(dist_h)))))*180)/Math.PI;
if (dist_h > 0 && dist_v <= 0){
if (angulo < 45) return 3;
if (angulo > 45) return 2;
}
if (dist_h <= 0 && dist_v <= 0){
if (angulo < 45) return 1;
if (angulo > 45) return 2;
}
if (dist_h <= 0 && dist_v > 0){
if (angulo < 45) return 1;
if (angulo > 45) return 4;
}
if (dist_h > 0 && dist_v > 0){
if (angulo < 45) return 3;
if (angulo > 45) return 4;
}
};
//función que maneja las colisiones entre todos los objetos
function colision (){
for (var i=0; i<objetos.length-1; i++){
	for (var j=i+1; j<objetos.length; j++){
	if (check_colision(objetos[i],objetos[j])){
	var vx_i= calc_velocidad_actual_x(objetos[i]);
	var vy_i= calc_velocidad_actual_y(objetos[i]);
	var vx_j= calc_velocidad_actual_x(objetos[j]);
	var vy_j= calc_velocidad_actual_y(objetos[j]);
	switch (lado_colision(objetos[i],objetos[j])){
	case 1:
		friccion_y(objetos[i],objetos[j]);
		var p=j;
		objetos[i].velocidad_inicial_x=(objetos[j].masa*vx_j+objetos[i].masa*vx_i+coeficientes[0][objetos[i].material][objetos[j].material]*(vx_j-vx_i)*objetos[j].masa)/(objetos[j].masa+objetos[i].masa);
		objetos[p].x=objetos[p].x_anterior;
		objetos[p].x_inicial=objetos[p].x;
		objetos[p].tiempo_inicial_x=indice_frame;
 		p=i;
		objetos[j].velocidad_inicial_x=vx_j+(objetos[i].masa*vx_i-(objetos[i].masa*objetos[i].velocidad_inicial_x))/objetos[j].masa;
		objetos[p].x=objetos[p].x_anterior;
		objetos[p].x_inicial=objetos[p].x;
		objetos[p].tiempo_inicial_x=indice_frame;
		
		break;
	case 2:
		friccion_x(objetos[i],objetos[j]);
		var p=j;
		objetos[j].velocidad_inicial_y=(objetos[i].masa*vy_i+objetos[j].masa*vy_j+coeficientes[0][objetos[i].material][objetos[j].material]*(vy_i-vy_j)*objetos[i].masa)/(objetos[i].masa+objetos[j].masa);
		objetos[p].y=objetos[p].y_anterior;
		objetos[p].y_inicial=objetos[p].y;
		objetos[p].tiempo_inicial_y=indice_frame;
 		p=i;
		objetos[i].velocidad_inicial_y=vy_i+(objetos[j].masa*vy_j-(objetos[j].masa*objetos[j].velocidad_inicial_y))/objetos[i].masa;
		objetos[p].y=objetos[p].y_anterior;
		objetos[p].y_inicial=objetos[p].y;
		objetos[p].tiempo_inicial_y=indice_frame;
		break;
	case 3:
		friccion_y(objetos[i],objetos[j]);
		var p=j
		objetos[i].velocidad_inicial_x=(objetos[j].masa*vx_j+objetos[i].masa*vx_i+coeficientes[0][objetos[i].material][objetos[j].material]*(vx_j-vx_i)*objetos[j].masa)/(objetos[j].masa+objetos[i].masa);
		objetos[p].x=objetos[p].x_anterior;
		objetos[p].x_inicial=objetos[p].x;
		objetos[p].tiempo_inicial_x=indice_frame;
 		p=i;
		objetos[j].velocidad_inicial_x=vx_j+(objetos[i].masa*vx_i-(objetos[i].masa*objetos[i].velocidad_inicial_x))/objetos[j].masa;
		objetos[p].x=objetos[p].x_anterior;
		objetos[p].x_inicial=objetos[p].x;
		objetos[p].tiempo_inicial_x=indice_frame;
		break;
	case 4:
		friccion_x(objetos[i],objetos[j]);
		var p=j;
		objetos[j].velocidad_inicial_y=(objetos[i].masa*vy_i+objetos[j].masa*vy_j+coeficientes[0][objetos[i].material][objetos[j].material]*(vy_i-vy_j)*objetos[i].masa)/(objetos[i].masa+objetos[j].masa);
		objetos[p].y=objetos[p].y_anterior;
		objetos[p].y_inicial=objetos[p].y;
		objetos[p].tiempo_inicial_y=indice_frame;
 		p=i;
		objetos[i].velocidad_inicial_y=vy_i+(objetos[j].masa*vy_j-(objetos[j].masa*objetos[j].velocidad_inicial_y))/objetos[i].masa;
		objetos[p].y=objetos[p].y_anterior;
		objetos[p].y_inicial=objetos[p].y;
		objetos[p].tiempo_inicial_y=indice_frame;
		break;
	default:
		//alert("error: colision no detectada");
	};
	};
};
};
};
//calcula la desaceleración horizontal que experimenta obj al chocar o deslizarse sobre una superficie
function friccion_x(obj1, obj2){
	if (obj2 == 0){
//si choca con le borde de zona
		var vel_x=calc_velocidad_actual_x(obj1);
		var dvel_x=coeficientes[1][obj1.material][3]*(Math.abs(aceleracion_amb_y)+obj1.aceleracion_y)*(frame/1000);
		if(vel_x < 0){
			obj1.x_inicial=obj1.x;
			if (dvel_x>= (Math.abs(vel_x))){
				obj1.velocidad_inicial_x=0;
				obj1.x_inicial=obj1.x;
			}else{
				obj1.velocidad_inicial_x=vel_x+dvel_x;
			};
			obj1.tiempo_inicial_x=indice_frame;
		}else if(vel_x > 0){
			obj1.x_inicial=obj1.x;
			if (dvel_x>= (Math.abs(vel_x))){
				obj1.velocidad_inicial_x=0;
				obj1.x_inicial=obj1.x;
			}else{
				obj1.velocidad_inicial_x=vel_x-dvel_x;
			};
			obj1.tiempo_inicial_x=indice_frame;
		};
	}else{
//si choca con otro objeto
		var vel1_x=calc_velocidad_actual_x(obj1);
		var vel2_x=calc_velocidad_actual_x(obj2);
		var dvel1_x=coeficientes[1][obj1.material][obj2.material]*(Math.abs(aceleracion_amb_y)+obj1.aceleracion_y)*(frame/1000);
		var dvel2_x=coeficientes[1][obj2.material][obj1.material]*(Math.abs(aceleracion_amb_y)+obj2.aceleracion_y)*(frame/1000);
		if(vel1_x < 0){
			obj1.x_inicial=obj1.x;
			if (dvel1_x>= (Math.abs(vel1_x))){
				obj1.velocidad_inicial_x=0;
				obj1.x_inicial=obj1.x;
			}else{
				obj1.velocidad_inicial_x=vel1_x+dvel1_x;
			};
			obj1.tiempo_inicial_x=indice_frame;
		}else if(vel1_x > 0){
			obj1.x_inicial=obj1.x;
			if (dvel1_x>= (Math.abs(vel1_x))){
				obj1.velocidad_inicial_x=0;
				obj1.x_inicial=obj1.x;
			}else{
				obj1.velocidad_inicial_x=vel1_x-dvel1_x;
			};
		obj1.tiempo_inicial_x=indice_frame;
		};
		if(vel2_x < 0){
			obj2.x_inicial=obj2.x;
			if (dvel_x>= (Math.abs(vel_x))){
				obj2.velocidad_inicial_x=0;
				obj2.x_inicial=obj2.x;
			}else{
				obj2.velocidad_inicial_x=vel2_x+dvel2_x;
			};
			obj2.tiempo_inicial_x=indice_frame;
		}else if(vel2_x > 0){
			obj2.x_inicial=obj2.x;
			if (dvel2_x>= (Math.abs(vel2_x))){
				obj2.velocidad_inicial_x=0;
				obj2.x_inicial=obj2.x;
			}else{
				obj2.velocidad_inicial_x=vel2_x-dvel2_x;
			};
			obj2.tiempo_inicial_x=indice_frame;
		};
	};
};
//calcula la desaceleración vertical que experimenta obj al chocar o deslizarse sobre una superficie
function friccion_y(obj1, obj2){
	if (obj2 == 0){
//si choca con le borde de zona
		var vel_y=calc_velocidad_actual_y(obj1);
		var dvel_y=coeficientes[1][obj1.material][3]*(Math.abs(aceleracion_amb_x)+obj1.aceleracion_x)*(frame/1000);
		if(vel_y < 0){
			obj1.y_inicial=obj1.y;
			if (dvel_y>= (Math.abs(vel_y))){
				obj1.velocidad_inicial_y=0;
				obj1.y_inicial=obj1.y;
			}else{
				obj1.velocidad_inicial_y=vel_y+dvel_y;
			};
			obj1.tiempo_inicial_y=indice_frame;
		}else if(vel_y > 0){
			obj1.y_inicial=obj1.y;
			if (dvel_y>= (Math.abs(vel_y))){
				obj1.velocidad_inicial_y=0;
				obj1.y_inicial=obj1.y;
			}else{
				obj1.velocidad_inicial_y=vel_y-dvel_y;
			};
			obj1.tiempo_inicial_y=indice_frame;
		};
	}else{
//si choca con otro objeto
		var vel1_y=calc_velocidad_actual_y(obj1);
		var vel2_y=calc_velocidad_actual_y(obj2);
		var dvel1_y=coeficientes[1][obj1.material][obj2.material]*(Math.abs(aceleracion_amb_x)+obj1.aceleracion_x)*(frame/1000);
		var dvel2_y=coeficientes[1][obj2.material][obj1.material]*(Math.abs(aceleracion_amb_x)+obj2.aceleracion_x)*(frame/1000);
		if(vel1_y < 0){
			obj1.y_inicial=obj1.y;
			if (dvel1_y>= (Math.abs(vel1_y))){
				obj1.velocidad_inicial_y=0;
				obj1.y_inicial=obj1.y;
			}else{
				obj1.velocidad_inicial_y=vel1_y+dvel1_y;
			};
			obj1.tiempo_inicial_y=indice_frame;
		}else if(vel1_y > 0){
			obj1.y_inicial=obj1.y;
			if (dvel1_y>= (Math.abs(vel1_y))){
				obj1.velocidad_inicial_y=0;
				obj1.y_inicial=obj1.y;
			}else{
				obj1.velocidad_inicial_y=vel1_y-dvel1_y;
			};
		obj1.tiempo_inicial_y=indice_frame;
		};
		if(vel2_y < 0){
			obj2.y_inicial=obj2.y;
			if (dvel_y>= (Math.abs(vel_y))){
				obj2.velocidad_inicial_y=0;
				obj2.y_inicial=obj2.y;
			}else{
				obj2.velocidad_inicial_y=vel2_y+dvel2_y;
			};
			obj2.tiempo_inicial_y=indice_frame;
		}else if(vel2_y > 0){
			obj2.y_inicial=obj2.y;
			if (dvel2_y>= (Math.abs(vel2_y))){
				obj2.velocidad_inicial_y=0;
				obj2.y_inicial=obj2.y;
			}else{
				obj2.velocidad_inicial_y=vel2_y-dvel2_y;
			};
			obj2.tiempo_inicial_y=indice_frame;
		};
	};
};
//upDate ()
//función principal del motor físico.
function upDate (){
indice_frame++;
//movimiento
for (var n=0;n< objetos.length; n++){
movimiento_x(objetos[n]);
movimiento_y(objetos[n]);
check_colision_zona(objetos[n]);
};
//colisión entre objetos
colision();
//actualizar UI
for (var n=0;n< objetos.length; n++){
objetos[n].mascara.style.left=objetos[n].x*escala;
objetos[n].mascara.style.top=objetos[n].y*escala;
};
};
