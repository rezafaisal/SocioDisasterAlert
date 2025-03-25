import { useState, useEffect } from "react";
import { Progress, Tooltip, Button, Card, SimpleGrid } from "@mantine/core";

export const Loader3Bar = () => {
  const [progress1, setProgress1] = useState(0);
  const [progress2, setProgress2] = useState(0);
  const [progress3, setProgress3] = useState(0);
  const [tooltip, setTooltip] = useState("Connect Media Sosial");
  const [intervalId, setIntervalId] = useState<ReturnType<
    typeof setInterval
  > | null>(null);
  const [totalSaksiMata, setTotalSaksiMata] = useState(0);
  const [totalBerita, setTotalBerita] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const steps = [
    {
      label: "Melakukan Pengambilan Data",
      color: "cyan",
      progressState: progress1,
      setProgress: setProgress1,
    },
    {
      label: "Melakukan Klasifikasi Data",
      color: "pink",
      progressState: progress2,
      setProgress: setProgress2,
    },
    {
      label: "Menyimpan Data Ke Database",
      color: "orange",
      progressState: progress3,
      setProgress: setProgress3,
    },
  ];

  useEffect(() => {
    if (isCompleted && intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [isCompleted, intervalId]);

  useEffect(() => {
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const startProgress = () => {
    if (intervalId) clearInterval(intervalId);

    setProgress1(0);
    setProgress2(0);
    setProgress3(0);
    setTooltip(steps[0].label);
    setIsCompleted(false);

    let currentStep = 0;

    const startInterval = (stepIndex: number) => {
      const newIntervalId = setInterval(() => {
        steps[stepIndex].setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(newIntervalId);
            const nextStep = stepIndex + 1;
            if (nextStep < steps.length) {
              setTooltip(steps[nextStep].label);
              startInterval(nextStep);
            } else {
              setIsCompleted(true);
              renderTotalSaksiMata();
            }
            return 100;
          }

          const increment = stepIndex === 1 ? 0.2 : 1;
          const newProgress = oldProgress + increment;

          return newProgress;
        });
      }, 200);

      setIntervalId(newIntervalId);
    };

    startInterval(currentStep);
  };

  const renderTotalSaksiMata = () => {
    const saksiMata = Math.floor(Math.random() * 150); // Ganti dengan logika sesuai kebutuhan
    setTotalSaksiMata(saksiMata);
    renderTotalBerita(); // Hitung total berita setelah selesai total saksi mata
  };

  const renderTotalBerita = () => {
    const berita = Math.floor(Math.random() * 150); // Ganti dengan logika sesuai kebutuhan
    setTotalBerita(berita);
  };

  const resetProgress = () => {
    if (intervalId) clearInterval(intervalId);
    setProgress1(0);
    setTooltip("Connect Media Sosial");
    setTotalSaksiMata(0);
    setTotalBerita(0);
    setIsCompleted(false);
    setIntervalId(null);

    setIsCancelling(true);
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  };

  return (
    <div>
      <div className="flex gap-5">
        <Button
          className="mb-5"
          onClick={startProgress}
          disabled={progress1 > 0}
        >
          Connect
        </Button>
        <Button
          color="red"
          className="mb-5"
          onClick={resetProgress}
          disabled={progress1 === 0 || isCancelling || isCompleted}
          loading={isCancelling}
        >
          Batalkan
        </Button>
      </div>
      <SimpleGrid cols={1} spacing="lg">
        {steps.map((step, index) => (
          <Card key={index} shadow="sm" p="lg">
            <p className="font-medium text-lg mb-2 text-black">{step.label}</p>
            <Progress.Root size={40}>
              <Tooltip label={tooltip === step.label ? tooltip : ""}>
                <Progress.Section value={step.progressState} color={step.color}>
                  <Progress.Label>{step.label}</Progress.Label>
                </Progress.Section>
              </Tooltip>
            </Progress.Root>
          </Card>
        ))}
      </SimpleGrid>
      {isCompleted && (
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
    </div>
  );
};

export default Loader3Bar;
