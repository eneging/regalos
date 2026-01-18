"use client";
import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, AlertCircle, FileText, MapPin, User, Mail, Phone, ShoppingBag } from "lucide-react";

// --- COMPONENTE INPUT MEJORADO VISUALMENTE ---
const InputGroup = ({ 
  label, 
  name, 
  value, 
  onChange, 
  error, 
  type = "text", 
  placeholder, 
  options = [], 
  inputMode,
  icon: Icon 
}: any) => (
  <div className="group flex flex-col space-y-2">
    {/* Label con estilo "Premium" y efecto al hacer foco */}
    <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] font-bold text-gray-500 group-focus-within:text-amber-400 transition-colors duration-300 ml-1">
      {label}
    </label>
    
    <div className="relative">
      {/* Input con mejor tipografía y espaciado */}
      {options.length > 0 ? (
        <div className="relative">
             <select
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full bg-[#252525] hover:bg-[#2f2f2f] border ${error ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-amber-500/50'} text-white rounded-xl py-3.5 px-4 focus:ring-0 focus:outline-none transition-all appearance-none cursor-pointer text-base md:text-lg shadow-sm`}
            >
                {options.map((opt: any) => (
                <option key={opt.value} value={opt.value} className="bg-[#1c1c1c] py-2">{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronRight className="rotate-90 w-4 h-4" />
            </div>
        </div>
      ) : (
        <div className="relative">
            {Icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-amber-400 transition-colors">
                    <Icon size={18} />
                </div>
            )}
            <input
                name={name}
                type={type}
                inputMode={inputMode}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-[#252525] hover:bg-[#2f2f2f] border ${error ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-amber-500/50'} text-white rounded-xl py-3.5 ${Icon ? 'pl-11' : 'pl-4'} pr-4 focus:ring-0 focus:outline-none transition-all placeholder-white/20 text-base md:text-lg shadow-sm font-medium`}
            />
        </div>
      )}
    </div>
    
    {/* Mensaje de error más elegante */}
    {error && (
      <div className="animate-in slide-in-from-top-1 fade-in duration-200">
          <p className="text-red-400 text-xs ml-1 flex items-center gap-1.5 font-medium bg-red-500/10 py-1 px-2 rounded w-fit">
            <AlertCircle size={12}/> {error[0]}
          </p>
      </div>
    )}
  </div>
);

export default function LibroReclamaciones() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [codigo, setCodigo] = useState("");
  
  const [formData, setFormData] = useState({
    nombres: "",
    documento_tipo: "DNI",
    documento_numero: "",
    direccion: "",
    telefono: "",
    email: "",
    tipo: "reclamo",
    producto_servicio: "",
    monto: "",
    descripcion: "",
    pedido: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (currentStep: number) => {
    const currentErrors: Record<string, string[]> = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.nombres) currentErrors.nombres = ["El nombre es obligatorio"];
      if (!formData.documento_numero) currentErrors.documento_numero = ["El documento es obligatorio"];
      if (!formData.email || !formData.email.includes("@")) currentErrors.email = ["Email inválido"];
      if (!formData.direccion) currentErrors.direccion = ["La dirección es obligatoria"];
    }

    if (currentStep === 2) {
      if (!formData.producto_servicio) currentErrors.producto_servicio = ["Indique el producto o servicio"];
      if (!formData.descripcion) currentErrors.descripcion = ["La descripción es obligatoria"];
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      isValid = false;
    }
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  async function handleSubmit() {
    if (!validateStep(3)) return;
    if (!formData.pedido) {
        setErrors({ pedido: ["Debes detallar qué solución esperas"] });
        return;
    }
    setLoading(true);
    try {
      // Simulación rápida para UI (quitar setTimeout y descomentar fetch)
      await new Promise(r => setTimeout(r, 1500)); 
      /*
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/libro-reclamaciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setErrors(data.errors || {}); setLoading(false); return; }
      setCodigo(data.codigo);
      */
     setCodigo("REC-" + Math.floor(Math.random() * 10000));
    } catch (error) {
        console.error("Error", error);
    } finally {
        setLoading(false);
    }
  }

  if (codigo) {
    return (
      <section className="min-h-screen bg-[#0a0a0a] px-4 py-12 flex justify-center items-center font-sans">
        <div className="bg-[#1c1c1c] border border-white/5 p-8 rounded-3xl w-full max-w-md text-center animate-in fade-in zoom-in duration-500 shadow-2xl shadow-green-900/10">
            <div className="w-24 h-24 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                <CheckCircle className="text-white w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">¡Registrado!</h2>
            <p className="text-gray-400 mb-8 text-lg leading-relaxed">Hemos recibido tu solicitud correctamente y la atenderemos a la brevedad.</p>
            <div className="bg-black/30 p-6 rounded-2xl border border-dashed border-white/10 mb-8 backdrop-blur-sm">
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2 font-bold">Código de seguimiento</p>
                <p className="text-4xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 select-all tracking-wider">{codigo}</p>
            </div>
            <button onClick={() => window.location.reload()} className="text-amber-500 hover:text-amber-400 font-medium tracking-wide text-sm py-2 px-4 hover:bg-amber-500/10 rounded-lg transition-all">
                VOLVER AL INICIO
            </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1f1f1f] via-[#0a0a0a] to-[#0a0a0a] px-4 py-8 md:py-16 flex justify-center items-center font-sans">
      <div className="w-full max-w-2xl">
        
        {/* Header Branding */}
        <div className="text-center mb-10 space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Libro de Reclamaciones</h1>
            <p className="text-amber-500/90 font-medium tracking-wide uppercase text-xs md:text-sm">Gestión de Calidad y Servicio al Cliente</p>
        </div>

        {/* Custom Progress Bar */}
        <div className="flex items-center justify-between mb-10 relative max-w-xs mx-auto">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[#333] -z-10"></div>
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-amber-500 transition-all duration-500 ease-out -z-10`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
            {[1, 2, 3].map((num) => (
                <div key={num} className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base transition-all duration-500 border-4 ${step >= num ? 'bg-amber-500 border-[#0a0a0a] text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-110' : 'bg-[#222] border-[#0a0a0a] text-gray-600'}`}>
                    {num}
                </div>
            ))}
        </div>

        <form className="bg-[#141414]/80 backdrop-blur-xl p-6 md:p-10 rounded-[2rem] shadow-2xl border border-white/5 space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                <div className="border-b border-white/5 pb-4 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Datos Personales</h3>
                    <p className="text-gray-500 text-sm mt-1">Ingresa tus datos para contactarte.</p>
                </div>
                
                <InputGroup 
                    label="Nombre Completo" 
                    name="nombres" 
                    icon={User}
                    value={formData.nombres} 
                    onChange={handleChange} 
                    error={errors.nombres}
                    placeholder="Ej. Juan Pérez" 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="col-span-1">
                        <InputGroup 
                            label="Tipo Doc." 
                            name="documento_tipo" 
                            value={formData.documento_tipo}
                            onChange={handleChange}
                            options={[{label:'DNI', value:'DNI'}, {label:'C.E.', value:'CE'}, {label:'Pasaporte', value:'PAS'}]} 
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <InputGroup 
                            label="Nro. Documento" 
                            name="documento_numero" 
                            icon={FileText}
                            value={formData.documento_numero}
                            onChange={handleChange}
                            error={errors.documento_numero}
                            type="tel" 
                            inputMode="numeric" 
                            placeholder="00000000" 
                        />
                    </div>
                </div>

                <InputGroup 
                    label="Dirección" 
                    name="direccion" 
                    icon={MapPin}
                    value={formData.direccion}
                    onChange={handleChange}
                    error={errors.direccion}
                    placeholder="Av. Principal 123..." 
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup 
                        label="Teléfono" 
                        name="telefono" 
                        icon={Phone}
                        value={formData.telefono}
                        onChange={handleChange}
                        type="tel" 
                        inputMode="tel" 
                        placeholder="999 999 999" 
                    />
                    <InputGroup 
                        label="Correo Electrónico" 
                        name="email" 
                        icon={Mail}
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        type="email" 
                        inputMode="email" 
                        placeholder="ejemplo@correo.com" 
                    />
                </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                <div className="border-b border-white/5 pb-4 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Detalle del Incidente</h3>
                    <p className="text-gray-500 text-sm mt-1">Cuéntanos qué sucedió exactamente.</p>
                </div>
                
                <div>
                    <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] font-bold text-gray-500 ml-1 mb-3 block">Tipo de Solicitud</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({...prev, tipo: 'reclamo'}))}
                            className={`p-4 rounded-xl border-2 text-center transition-all duration-300 group ${formData.tipo === 'reclamo' ? 'bg-amber-500/10 border-amber-500' : 'bg-[#252525] border-transparent hover:bg-[#2f2f2f]'}`}
                        >
                            <span className={`font-bold block text-lg mb-1 ${formData.tipo === 'reclamo' ? 'text-amber-500' : 'text-gray-300 group-hover:text-white'}`}>Reclamo</span>
                            <span className="text-xs text-gray-500 font-medium leading-tight block">Disconformidad con producto/servicio</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({...prev, tipo: 'queja'}))}
                            className={`p-4 rounded-xl border-2 text-center transition-all duration-300 group ${formData.tipo === 'queja' ? 'bg-amber-500/10 border-amber-500' : 'bg-[#252525] border-transparent hover:bg-[#2f2f2f]'}`}
                        >
                            <span className={`font-bold block text-lg mb-1 ${formData.tipo === 'queja' ? 'text-amber-500' : 'text-gray-300 group-hover:text-white'}`}>Queja</span>
                            <span className="text-xs text-gray-500 font-medium leading-tight block">Malestar con la atención recibida</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="col-span-1 md:col-span-2">
                        <InputGroup 
                            label="Producto / Servicio" 
                            name="producto_servicio" 
                            icon={ShoppingBag}
                            value={formData.producto_servicio}
                            onChange={handleChange}
                            error={errors.producto_servicio}
                            placeholder="Ej. Lomo Saltado / Atención" 
                        />
                    </div>
                    <div className="relative col-span-1">
                        <div className="absolute left-4 top-[44px] z-10 text-amber-500 font-bold">S/</div>
                        <InputGroup 
                            label="Monto (Opcional)" 
                            name="monto" 
                            value={formData.monto}
                            onChange={handleChange}
                            type="number" 
                            inputMode="decimal" 
                            placeholder="0.00" 
                        />
                        <style jsx>{`input[name="monto"] { padding-left: 2.5rem !important; }`}</style>
                    </div>
                </div>

                <div className="group flex flex-col space-y-2">
                    <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] font-bold text-gray-500 group-focus-within:text-amber-400 transition-colors ml-1">Descripción de los hechos</label>
                    <textarea 
                        name="descripcion" 
                        value={formData.descripcion}
                        onChange={handleChange}
                        className={`w-full bg-[#252525] hover:bg-[#2f2f2f] border ${errors.descripcion ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-amber-500/50'} text-white rounded-xl p-4 h-36 focus:ring-0 focus:outline-none transition-all resize-none text-base md:text-lg leading-relaxed placeholder-white/20`}
                        placeholder="Por favor detalle lo ocurrido..."
                    />
                    {errors.descripcion && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.descripcion[0]}</p>}
                </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-500">
                <div className="border-b border-white/5 pb-4 mb-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Solución Esperada</h3>
                    <p className="text-gray-500 text-sm mt-1">¿Cómo podemos arreglar esto para ti?</p>
                </div>

                <div className="group flex flex-col space-y-2">
                    <label className="text-[11px] md:text-xs uppercase tracking-[0.15em] font-bold text-gray-500 group-focus-within:text-amber-400 transition-colors ml-1">Tu pedido</label>
                    <textarea 
                        name="pedido" 
                        value={formData.pedido}
                        onChange={handleChange}
                        className={`w-full bg-[#252525] hover:bg-[#2f2f2f] border ${errors.pedido ? 'border-red-500/50' : 'border-white/10 group-focus-within:border-amber-500/50'} text-white rounded-xl p-4 h-48 focus:ring-0 focus:outline-none transition-all resize-none text-base md:text-lg leading-relaxed placeholder-white/20`}
                        placeholder="Ej. Cambio del plato, anulación del cobro, disculpas del personal..."
                    />
                    {errors.pedido && <p className="text-red-400 text-xs ml-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.pedido[0]}</p>}
                </div>
            </div>
          )}

          {/* Buttons Layout */}
          <div className="pt-6 flex gap-4">
            {step > 1 && (
                <button
                    type="button"
                    onClick={() => setStep(prev => prev - 1)}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all flex items-center justify-center gap-2 active:scale-95 text-base md:text-lg"
                >
                    <ChevronLeft size={20} /> <span className="hidden md:inline">Volver</span>
                </button>
            )}
            
            {step < 3 ? (
                <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 text-base md:text-lg"
                >
                    Siguiente <ChevronRight size={20} />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold tracking-wide transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70 disabled:grayscale text-base md:text-lg"
                >
                    {loading ? (
                        <span className="animate-pulse">Procesando...</span>
                    ) : (
                        <>Finalizar Reclamo <CheckCircle size={20} /></>
                    )}
                </button>
            )}
          </div>

        </form>
      </div>
    </section>
  );
}