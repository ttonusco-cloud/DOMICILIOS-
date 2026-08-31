const $=id=>document.getElementById(id);
const fields=["pedido","estado","recogida","entrega","direccion","valor"];
const base=location.href.split("?")[0].split("#")[0];

function params(){
 const p=new URLSearchParams();
 fields.forEach(id=>p.set(id,$(id).value.trim()));
 return base+"?"+p.toString();
}
function preview(){
 const estado=$("estado").value;
 $("preview").innerHTML=`<h3>🛵 Vista previa para el domiciliario</h3>
 <div><b>🧾 Pedido:</b> ${$("pedido").value||"—"}</div>
 <div><b>🏪 Recogida:</b> ${$("recogida").value||"—"}</div>
 <div><b>📍 Entrega:</b> ${$("entrega").value||"—"}<br>${$("direccion").value||"—"}</div>
 <div><b>💰 Domicilio:</b> ${$("valor").value?new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(Number($("valor").value)):"Por confirmar"}</div>
 <div class="state ${estado==="pagado"?"paid":"unpaid"}">${estado==="pagado"?"🟢 PEDIDO PAGADO — NO COBRAR AL CLIENTE":"🔴 PEDIDO NO PAGADO — COBRAR AL CLIENTE"}</div>`;
}
function generate(){
 if(!$("panel").reportValidity())return;
 const url=params();
 $("generated").value=url;
 $("result").classList.remove("hidden");
 localStorage.setItem("ultima_solicitud_domicilio",url);
 return url;
}
$("panel").addEventListener("input",preview);
$("panel").addEventListener("submit",e=>{e.preventDefault();generate()});
$("copy").onclick=async()=>{const url=generate();if(!url)return;await navigator.clipboard.writeText(url);alert("Enlace copiado. Ya puedes pegarlo en el grupo de domiciliarios.")};
$("share").onclick=async()=>{const url=generate();if(!url)return;if(navigator.share){await navigator.share({title:"Solicitud de domicilio",text:"🛵 Solicitud de domicilio",url})}else{await navigator.clipboard.writeText(url);alert("Tu navegador no permite compartir directamente. El enlace fue copiado.")}};

const q=new URLSearchParams(location.search);
fields.forEach(id=>{if(q.has(id))$(id).value=q.get(id)});
preview();
if(q.has("pedido")){ $("generated").value=location.href;$("result").classList.remove("hidden"); }

/*
  IMPORTANTE:
  Este mismo archivo puede actuar como panel y como enlace compartible.
  Para que el domiciliario vea el formulario de aceptación, debes usar
  el archivo "domicilio.html" de la carpeta del formulario y cambiar
  base arriba por la URL pública de ese archivo.
*/