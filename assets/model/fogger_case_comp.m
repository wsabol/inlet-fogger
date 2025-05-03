clear
close all
clc

Td_0 = 5/9*([60 80 140]-32);
Ta_0 = 5/9*(80-32);
flow = 50;
RH_WB = 0.4; % RH or WB
Dd0 = 25;
load = 1;
qWB = 0;

results = [];
% results = [Td_0 Ta_f Dd_f ma_f RH_f row_air time_f AWB]

for i = 1:length(Td_0)
    [Ta_f Dd_f RH_f row_air mass time_f AWB s_drp s_air h_drp h_air qd qa c_v Dd_v RH_v] = mee_funct(Td_0(i), Ta_0, flow, load, RH_WB, Dd0, qWB);
    
    results(2*i-1, :) = Dd_v;
    results(2*i, :) = RH_v;
end

time = 0:0.0001:1.5;

%Diameter
figure(1)
plot(time, results(1, :), 'b');
hold on
plot(time, results(3, :), 'r');
plot(time, results(5, :), 'k');
xlabel('Time [s]')
ylabel('Diameter [\mum]')
legend('Td = 60 \circF', 'Td = 80 \circF', 'Td = 140 \circF', 'Location', 'Best')

%RH
figure(2)
plot(time, results(2, :), 'b');
hold on
plot(time, results(4, :), 'r');
plot(time, results(6, :), 'k');
xlabel('Time [s]')
ylabel('Relative Humidity [%]')
legend('Td = 60 \circF', 'Td = 80 \circF', 'Td = 140 \circF', 'Location', 'Best')