killall node
cd api/ 
./setup.sh 
npm start &
process_id=$!
cd ..

sleep 2
./ins_production.sh 

cd java/
killall java
./run.sh &
cd ..

cd front/
npm start &

wait $process_id
