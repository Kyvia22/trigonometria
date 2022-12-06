//Função que converte graus Celsius em Radianos
			//Esta função será necessário, pois, os métodos do Canvas trabalha com radianos
function celsToRad(celsius) {
return celsius * Math.PI / 180;
}
			
//Objeto Canvas
var canvas = {
element	: document.getElementById('canvas'),
				ctx		: null,
				init 	: function () {
					this.ctx = this.element.getContext('2d');
				},
				clear	: function () { //Limpa a tela do canvas para poder redesenhar
					this.ctx.clearRect(0, 0, this.width(), this.height());
				},
			  width: function () {
					return this.element.width;
				},
				height: function () {
					return this.element.height;
				},
				ponto	: function (x, y, cor, raio) { //Cria um círculo. Cor e raio são opcionais
					this.ctx.beginPath();
					this.ctx.arc(x, y, 3, 0, celsToRad( raio || 360 ), true);
					this.ctx.fillStyle = cor || '#00ff18';//pontinho q roda em volta
					this.ctx.fill();
				}
			}
			    
			//Objeto círculo
			//Contém todos os cálculos referente ao ciclo trigonométrico
			//E a função para desenhar tudo na tela.
			var circulo = {
				raio 	: 170, //Raio de círculo
				angulo	: 0, //Angulo do círculo
				
				//A origem no plano cartesiano se dá pelos pontos 0 e 0
				//Os pontos de origem do canvas começa no canto superior esquerdo
				//Assim, a origem do círculo será no meio do canvas, que é a metade de sua altura e largura
				origemX	: canvas.width() / 2, 
				origemY	: canvas.height() / 2,
				
				//Cálculo do seno
				//O seno do ângulo deve ser multiplicado pelo raio.
				//Isto possibilita que o círculo possa ter qualquer tamanho
				sen		: function () {
					return this.raio * Math.sin( celsToRad(this.angulo) );
				},
				
				//Cálcula o seno
				//Mesma ideia que o seno
				cos		: function () {
					return this.raio * Math.cos( celsToRad(this.angulo) );
				},
				
				//Cálcula o tangente
				//Mesma ideia que o seno
				tan		: function () {
					return this.origemY + -(this.raio * Math.tan( celsToRad(this.angulo) ));
				},
				
				//Ponto X do angulo projetado
				paX		: function () {
					return this.origemX + this.cos();
				},
				
				//Ponto Y do angulo projetado
				paY		: function () {
					return this.origemY - this.sen();
				},
				
				//Renderiza os objetos geométriocos no canvas
				render	: function () {
					//Limpa o canvas
					canvas.clear();
					
					//reset de cor, pois, algumas linhas terão cores diferentes
					canvas.ctx.beginPath();
					canvas.ctx.strokeStyle = '#000';
					
					//Círculo maior
					canvas.ctx.arc(this.origemX, this.origemY, this.raio, 0, celsToRad(360));
					canvas.ctx.stroke();
					
					//Ponto no meio (origem)
					canvas.ctx.arc(this.origemX, this.origemY, 2, 0, celsToRad(360));
					canvas.ctx.stroke();
					
					//Linha eixo y
					canvas.ctx.moveTo(this.origemY, 0);
					canvas.ctx.lineTo(this.origemY, canvas.height());
					canvas.ctx.stroke();
					
					//Linha eixo x
					canvas.ctx.moveTo(0, this.origemX);
					canvas.ctx.lineTo(canvas.height(), this.origemX);
					canvas.ctx.stroke();
					
					//Linha tangente
					canvas.ctx.moveTo(this.origemX + this.raio, 0);
					canvas.ctx.lineTo(this.origemX + this.raio, canvas.height());
					canvas.ctx.stroke();
					
					//Ponto do ângulo projetado
					canvas.ponto(this.paX(), this.paY());
					
					//Reta cosseno até Ponto do ângulo projetado
					canvas.ctx.beginPath();
					canvas.ctx.strokeStyle = '#ff001f';//linha rente eixo X
					canvas.ctx.moveTo(this.paX(), this.origemY);
					canvas.ctx.lineTo(this.paX(), this.paY());
					canvas.ctx.stroke();
					
					//Reta seno até Ponto do ângulo projetado
					canvas.ctx.beginPath();
					canvas.ctx.strokeStyle = '#ff7300'; // linha rente eixo Y
					canvas.ctx.moveTo(this.origemX, this.paY());
					canvas.ctx.lineTo(this.paX(), this.paY());
					canvas.ctx.stroke();
					
					//Reta da origem até o ponto da tangente
					canvas.ctx.beginPath();
					canvas.ctx.strokeStyle = '#ff0073';// transpassa o centro
					//Se eixo X ponto do ponto do ângulo projetado for menor que a origem,
					//a reta deve  começar do ponto do ângulo projetado,
					//caso contrário, começa da origem
					var ltX = this.paX() < this.origemX ? this.paX() : this.origemX;
					var ltY = this.paX() < this.origemX ? this.paY() : this.origemY;
					canvas.ctx.moveTo(ltX, ltY);
					canvas.ctx.lineTo(this.origemX + this.raio, this.tan());
					canvas.ctx.stroke();
					
					//ponto da tangente
			//	canvas.ponto(this.origemX + this.raio, this.tan(), '#f8ff00');//ponto da reta a diteita
				}
			};
			
			//Inicia o canvas e renderiza os objetos geométricos
			canvas.init();
			circulo.render();
			
			//Input com o valor do ângulo
			var campo_angulo = document.getElementById('angulo');
			
			campo_angulo.addEventListener('change', function () {
				//Voltar para angulo zero ao atingir 360 graus
				this.value = this.value >= 360 ? 0 : this.value;
				//Altera o valor no objeto círculo e renderiza as modificações
				circulo.angulo = this.value;
				circulo.render();
			});
			
			var time; //Para o play e stop
			
			//Função que realiza a animação
			//Incrementa o ângulo a cada 100 milissegundos
			function anim () {
				campo_angulo.value = ++campo_angulo.value;
				//Troca de valor de um input pelo JS, não separa o evento 'change'
				//Disparando-o através do script
				campo_angulo.dispatchEvent(new Event('change'));
				time = setTimeout(anim, 200);
			}
			
			//Botão de ação play e stop
			document.getElementById('control').addEventListener('click', function () {
				this.innerHTML = this.dataset.play == 'Começa' ? 'Começa' : 'Pausa';
				this.dataset.play = this.dataset.play == 'Começa' ? 'Pausa' : 'Começa';
				
				if (this.dataset.play == 'Começa') {
					anim();
				} else {
					clearInterval(time);
				}
			});
