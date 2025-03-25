import { useState, useEffect } from "react";
import {
  Button,
  Stepper,
  Center,
  Container,
  Card,
  SimpleGrid,
} from "@mantine/core";

export const LoaderProses = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [totalSaksiMata, setTotalSaksiMata] = useState(0);
  const [totalBerita, setTotalBerita] = useState(0);

  const steps = [
    { label: "Connect Media Sosial" },
    { label: "Melakukan Pengambilan Data" },
    { label: "Selesai" },
  ];

  useEffect(() => {
    if (activeStep >= steps.length - 1 && intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
      // Set random data for total saksi mata and total berita
      const saksiMata = Math.floor(Math.random() * 150);
      const berita = Math.floor(Math.random() * 150);
      setTotalSaksiMata(saksiMata);
      setTotalBerita(berita);
    }
  }, [activeStep, intervalId]);

  const startProgress = () => {
    if (intervalId) clearInterval(intervalId);

    setActiveStep(0);
    setIsStarted(true);
    let currentStep = 0;
    const newIntervalId = setInterval(() => {
      setActiveStep((prevStep) => {
        if (prevStep >= steps.length - 1) {
          clearInterval(newIntervalId);
          return steps.length - 1;
        }
        return prevStep + 1;
      });

      currentStep += 1;
    }, 2000); // Interval waktu dalam milidetik

    setIntervalId(newIntervalId);
  };

  return (
    <Container>
      <Center>
        <Button className="mb-5" onClick={startProgress}>
          Connect
        </Button>
      </Center>
      <Stepper active={activeStep} onStepClick={setActiveStep} size="lg">
        {steps.map((step, index) => (
          <Stepper.Step
            disabled
            key={index}
            label={`Step ${index + 1}`}
            description={step.label}
            loading={
              isStarted && activeStep === index && index < steps.length - 1
            }
            color={
              activeStep > index ||
              (index === steps.length - 1 && activeStep === index)
                ? "green"
                : undefined
            }
          />
        ))}
      </Stepper>
      {activeStep === steps.length - 1 && (
        <SimpleGrid cols={3} spacing="lg" mt="xl">
          <Card shadow="sm" p="lg">
            <p className="font-medium text-md text-gray-600">
              Total Saksi Mata
            </p>
            <p className="font-extrabold text-4xl" color="black">
              {totalSaksiMata}
            </p>
          </Card>
          <Card shadow="sm" p="lg">
            <p className="font-medium text-md text-gray-600">Total Berita</p>
            <p className="font-extrabold text-4xl" color="black">
              {totalBerita}
            </p>
          </Card>
          <Card shadow="sm" p="lg">
            <p className="font-medium text-md text-gray-600">
              Total Data Yang Diambil
            </p>
            <p className="font-extrabold text-4xl" color="black">
              {totalSaksiMata + totalBerita}
            </p>
          </Card>
        </SimpleGrid>
      )}
    </Container>
  );
};

export default LoaderProses;
