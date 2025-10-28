import { useState } from "react";
import CustomInput from "./CustomInput";
import { formFields } from "../constants/tokeFields";
import {
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

const TokenLaunchpad = () => {
  const [formData, setFormData] = useState({
    tokenName: "",
    tokenSymbol: "",
    tokenSupply: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});
  const wallet = useWallet();
  const { connection } = useConnection();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    formFields.forEach((field) => {
      const value = formData[field.value];
      if (!value || value.toString().trim() === "") {
        newErrors[field.name] = `${field.name} is required`;
      } else if (field.type === "number" && Number(value) < 0) {
        newErrors[field.name] = `${field.name} cannot be negative`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    alert("✅ Token Created Successfully!");
    console.log("Form Data:", formData);

    setFormData({
      tokenName: "",
      tokenSymbol: "",
      tokenSupply: "",
      imageUrl: "",
    });
    setErrors({});

    const lamports = await getMinimumBalanceForRentExemptMint(connection);
    const keyPair = Keypair.generate();

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: keyPair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        keyPair.publicKey,
        9,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_PROGRAM_ID
      )
    );

    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.feePayer = wallet.publicKey;

    transaction.partialSign(keyPair);
    const signature = await wallet.sendTransaction(transaction, connection);
    console.log("Transaction signature:", signature);
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617] font-[Poppins] overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-white/5 border-b border-white/10">
        <h1 className="text-lg font-semibold text-white tracking-wide">
          🌑 Token Launchpad
        </h1>
        <div className="flex gap-3">
          <div className="wallet-btn-container">
            <WalletMultiButton />
          </div>
          <div className="wallet-btn-container">
            <WalletDisconnectButton />
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-2xl p-10 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] border border-white/20 z-10 mt-20">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-[#4f46e5] to-[#9333ea] p-5 rounded-2xl shadow-xl">
            <span className="text-white text-3xl">🪙</span>
          </div>
          <h2 className="text-3xl font-extrabold mt-4 text-white text-center tracking-tight">
            Launch Your Token
          </h2>
          <p className="text-gray-300 text-sm mt-2 text-center leading-relaxed">
            Fill in the details below to mint and deploy your SPL Token securely
            on the{" "}
            <span className="text-indigo-300 font-semibold">Solana Devnet</span>
            .
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {formFields.map((field, index) => (
            <div key={index}>
              <CustomInput
                label={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.value] || ""}
                onChange={(e) => handleChange(field.value, e.target.value)}
                error={errors[field.name]}
                labelColor="text-gray-300"
                placeholderColor="text-gray-400"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 mt-6 font-semibold text-lg text-white bg-gradient-to-r from-[#4338ca] via-[#6d28d9] to-[#7e22ce] rounded-xl shadow-lg hover:shadow-indigo-600/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer"
          >
            🚀 Create Token
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Make sure your wallet is connected to{" "}
          <span className="text-indigo-300 font-semibold">Solana Devnet</span>{" "}
          before creating a token.
        </p>
      </div>

      {/* Style Wallet Buttons */}
      <style>{`
        .wallet-btn-container > button {
          background: linear-gradient(90deg, #4f46e5, #9333ea);
          color: white !important;
          font-weight: 600;
          border-radius: 0.5rem;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
        }
        .wallet-btn-container > button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.6);
        }
      `}</style>
    </div>
  );
};

export default TokenLaunchpad;
