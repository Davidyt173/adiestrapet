import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Lock,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Check,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { SubscriptionState } from '../types';
import { storageService } from '../services/storage';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscriptionSuccess: (sub: SubscriptionState) => void;
  featureReason?: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onSubscriptionSuccess,
  featureReason,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly_19' | 'annual_179'>('annual_179');
  const [activationCode, setActivationCode] = useState<string>('');
  const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
  const [codeSuccessMsg, setCodeSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Contact via WhatsApp with pre-filled message for Mercado Pago
  const handleContactWhatsApp = () => {
    const planText =
      selectedPlan === 'annual_179'
        ? 'Plan Anual Premium (S/ 179,90/año - Ahorra 25%)'
        : 'Plan Mensual Premium (S/ 19,90/mes)';

    const message = `¡Hola! Deseo activar mi suscripción a AdiestraPet:
📦 Plan seleccionado: ${planText}
💳 Método de pago: Mercado Pago
🐾 Por favor, compártanme el link de pago o datos para la activación inmediata.`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Immediate activation via code or WhatsApp confirmation
  const handleActivateWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = activationCode.trim();

    if (!cleanCode) return;

    const newSub: SubscriptionState = {
      isPremium: true,
      planId: selectedPlan,
      planName: selectedPlan === 'annual_179' ? 'Plan Anual Premium' : 'Plan Mensual Premium',
      pricePEN: selectedPlan === 'annual_179' ? 179.9 : 19.9,
      billingProvider: 'Mercado Pago (WhatsApp)',
      receiptId: `MP-${Date.now().toString().slice(-6)}`,
      activatedAt: new Date().toISOString(),
    };

    storageService.setSubscription(newSub);
    setCodeSuccessMsg('¡Suscripción activada con éxito! Disfruta de AdiestraPet Premium.');

    setTimeout(() => {
      onSubscriptionSuccess(newSub);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1F2321] border border-[#354B45] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-[#E1E3DF]">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#005047] via-[#006A60] to-[#008779] p-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#70F6E3]/20 border border-[#70F6E3]/30 text-[#70F6E3] text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AdiestraPet Premium Canino</span>
          </div>

          <h3 className="text-xl font-black tracking-tight leading-tight">
            Acceso Total &amp; Bienestar Canino
          </h3>
          <p className="text-xs text-white/90 mt-1">
            {featureReason || 'Desbloquea diagnósticos etológicos ilimitados y guías paso a paso.'}
          </p>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Key Value Propositions */}
          <div className="space-y-2 text-xs bg-[#242826] p-3.5 rounded-2xl border border-[#354B45]">
            <div className="flex items-center gap-2 text-[#E1E3DF]">
              <CheckCircle2 className="w-4 h-4 text-[#70F6E3] flex-shrink-0" />
              <span>Diagnósticos multimodales con IA etológica y fotos ilimitadas.</span>
            </div>
            <div className="flex items-center gap-2 text-[#E1E3DF]">
              <CheckCircle2 className="w-4 h-4 text-[#70F6E3] flex-shrink-0" />
              <span>Planes de refuerzo positivo 100% libres de aversivos o castigo.</span>
            </div>
            <div className="flex items-center gap-2 text-[#E1E3DF]">
              <CheckCircle2 className="w-4 h-4 text-[#70F6E3] flex-shrink-0" />
              <span>Módulos de calma para ruidos urbanos y mototaxis en Perú.</span>
            </div>
            <div className="flex items-center gap-2 text-[#E1E3DF]">
              <CheckCircle2 className="w-4 h-4 text-[#70F6E3] flex-shrink-0" />
              <span>Certificados de logros y registro completo de progresos.</span>
            </div>
          </div>

          {/* Plan Selection with Price Anchoring */}
          <div className="grid grid-cols-1 gap-3">
            {/* Annual Plan (Featured with Price Anchoring) */}
            <div
              onClick={() => setSelectedPlan('annual_179')}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition flex flex-col gap-2 ${
                selectedPlan === 'annual_179'
                  ? 'border-[#70F6E3] bg-[#223631] shadow-lg shadow-[#006A60]/20'
                  : 'border-[#354B45] bg-[#242826] hover:border-[#4B635C]'
              }`}
            >
              {/* Highlight Badge */}
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-[11px] px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-stone-950" />
                <span>«AHORRA 25%»</span>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                      selectedPlan === 'annual_179'
                        ? 'border-[#70F6E3] bg-[#70F6E3]'
                        : 'border-[#89938E]'
                    }`}
                  >
                    {selectedPlan === 'annual_179' && <Check className="w-3.5 h-3.5 text-stone-900 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-white">Plan Anual</h4>
                      <span className="text-[10px] bg-[#006A60] text-[#70F6E3] font-bold px-1.5 py-0.2 rounded">
                        Pago único anual
                      </span>
                    </div>
                    <p className="text-xs text-[#70F6E3] font-bold mt-0.5">
                      Equivalente a S/ 14,99/mes
                    </p>
                  </div>
                </div>

                {/* Price block with anchor */}
                <div className="text-right">
                  <div className="text-[11px] text-[#89938E] line-through decoration-red-400">
                    S/ 238,80
                  </div>
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-lg font-black text-white">S/ 179,90</span>
                    <span className="text-[11px] text-[#A3EEDF] font-semibold">/año</span>
                  </div>
                </div>
              </div>

              {/* Anchoring & Savings Banner */}
              <div className="pt-2 border-t border-[#354B45]/70 flex items-center justify-between text-[11px]">
                <span className="text-[#C4C7C5]">
                  Precio de referencia anual: <span className="line-through text-[#89938E]">S/ 238,80</span>
                </span>
                <span className="text-amber-300 font-extrabold bg-amber-400/10 px-2 py-0.5 rounded-md">
                  Ahorro anual: S/ 58,90 (25% aprox.)
                </span>
              </div>
            </div>

            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly_19')}
              className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                selectedPlan === 'monthly_19'
                  ? 'border-[#70F6E3] bg-[#223631]'
                  : 'border-[#354B45] bg-[#242826] hover:border-[#4B635C]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    selectedPlan === 'monthly_19'
                      ? 'border-[#70F6E3] bg-[#70F6E3]'
                      : 'border-[#89938E]'
                  }`}
                >
                  {selectedPlan === 'monthly_19' && <Check className="w-3.5 h-3.5 text-stone-900 stroke-[3]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-white">Plan Mensual</h4>
                    <span className="text-[10px] bg-[#2D312E] text-[#C4C7C5] font-medium px-1.5 py-0.2 rounded">
                      Pago mensual
                    </span>
                  </div>
                  <p className="text-[11px] text-[#89938E]">Cobro recurrente mensual vía Mercado Pago</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-lg font-black text-white">S/ 19,90</span>
                  <span className="text-[11px] text-[#89938E] font-semibold">/mes</span>
                </div>
                <span className="text-[10px] text-[#89938E] block">Cobro mensual</span>
              </div>
            </div>
          </div>

          {/* Primary Action: Contact via WhatsApp for Mercado Pago */}
          <button
            onClick={handleContactWhatsApp}
            className="w-full py-3.5 px-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#25D366] text-white font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#25D366]/20 active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>
              Activar {selectedPlan === 'annual_179' ? 'Plan Anual' : 'Plan Mensual'} por WhatsApp
            </span>
          </button>

          {/* Activation Code / Manual Unlock Toggle */}
          <div className="pt-2 border-t border-[#354B45]/60 text-center">
            {!showCodeInput ? (
              <button
                type="button"
                onClick={() => setShowCodeInput(true)}
                className="text-[11px] text-[#70F6E3] hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>¿Ya pagaste por WhatsApp? Activa con tu código</span>
              </button>
            ) : (
              <form onSubmit={handleActivateWithCode} className="space-y-2 text-left pt-1">
                <label className="text-[11px] font-semibold text-[#89938E] block">
                  Ingresa tu código de activación o comprobante:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activationCode}
                    onChange={(e) => setActivationCode(e.target.value)}
                    placeholder="Ej. MP-179 o MI-PERRO"
                    className="flex-1 bg-[#191C1B] border border-[#354B45] focus:border-[#70F6E3] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006A60] hover:bg-[#008779] text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                  >
                    <span>Activar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {codeSuccessMsg && (
                  <p className="text-[11px] text-[#70F6E3] font-bold">{codeSuccessMsg}</p>
                )}
              </form>
            )}
          </div>

          {/* Secure Mercado Pago Information Note */}
          <div className="p-3 rounded-2xl bg-[#191C1B] border border-[#2D312E] text-[10px] text-[#89938E] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#70F6E3] flex-shrink-0 mt-0.5" />
            <span>
              Los cobros recurrentes y comprobantes son gestionados de manera personal y segura mediante <strong>Mercado Pago a través de WhatsApp</strong>. Precios en Soles (PEN). Sin cargos ocultos ni pasarelas externas dentro de la app.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
