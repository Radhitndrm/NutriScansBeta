import { ScrollView } from "react-native";
import useRegister from "./hooks/useRegister";
import Step1Form from "./components/Step1Form";
import Step2Form from "./components/Step2Form";

export default function RegisterScreen({ navigation }) {
  const register = useRegister(navigation);

  return (
    <ScrollView className="flex-1 bg-gray-50 px-6 py-8">
      {register.step === 1 ? (
        <Step1Form
          email={register.email} setEmail={register.setEmail}
          password={register.password} setPassword={register.setPassword}
          konfirmasi={register.konfirmasi} setKonfirmasi={register.setKonfirmasi}
          onLanjut={register.handleLanjut}
          onMasuk={() => navigation.goBack()}
        />
      ) : (
        <Step2Form
          kategori={register.kategori} setKategori={register.setKategori}
          trimester={register.trimester} setTrimester={register.setTrimester}
          namaAnak={register.namaAnak} setNamaAnak={register.setNamaAnak}
          usiaBalita={register.usiaBalita} setUsiaBalita={register.setUsiaBalita}
          loading={register.loading}
          onDaftar={register.handleDaftar}
          onKembali={register.handleKembali}
        />
      )}
    </ScrollView>
  );
}
