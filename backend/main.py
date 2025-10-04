from flask import Flask, request, jsonify
from flask_cors import CORS
import heapq

app = Flask(__name__)
# This line is updated to explicitly allow all websites to access your API.
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- SCHEDULING ALGORITHMS ---
# (All the scheduling logic functions remain the same)
def fcfs(processes):
    processes.sort(key=lambda x: x['arrival'])
    time = 0
    log = []
    ready_queue = []
    remaining_burst = {p['name']: p['burst'] for p in processes}
    process_queue = processes[:]
    
    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            ready_queue.append(process_queue.pop(0))

        current_process = None
        if ready_queue:
            current_process_obj = ready_queue.pop(0)
            current_process = current_process_obj['name']
            
            log_event = {
                'time': time,
                'process': current_process,
                'ready_queue': [p['name'] for p in ready_queue]
            }
            log.append(log_event)

            burst_time = remaining_burst[current_process]
            for _ in range(burst_time - 1):
                time += 1
                log.append({
                    'time': time,
                    'process': current_process,
                    'ready_queue': [p['name'] for p in ready_queue]
                })
            time += 1

        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log
# ... (sjf_non_preemptive, sjf_preemptive, priority_non_preemptive, priority_preemptive, round_robin functions are unchanged) ...
# NOTE: To keep the response concise, the other algorithm functions are omitted, 
# but they should remain in your file exactly as they were.
def sjf_non_preemptive(processes):
    processes.sort(key=lambda x: x['arrival'])
    time = 0
    log = []
    ready_queue = []
    remaining_burst = {p['name']: p['burst'] for p in processes}
    process_queue = processes[:]
    
    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            ready_queue.append(process_queue.pop(0))

        if ready_queue:
            ready_queue.sort(key=lambda p: p['burst'])
            current_process_obj = ready_queue.pop(0)
            current_process = current_process_obj['name']
            
            burst_time = remaining_burst[current_process]
            for i in range(burst_time):
                log.append({
                    'time': time,
                    'process': current_process,
                    'ready_queue': [p['name'] for p in ready_queue]
                })
                time += 1
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log

def sjf_preemptive(processes):
    time = 0
    log = []
    ready_queue = []
    remaining_burst = {p['name']: p['burst'] for p in processes}
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    
    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            heapq.heappush(ready_queue, (process_queue[0]['burst'], process_queue[0]['name'], process_queue[0]))
            process_queue.pop(0)

        if ready_queue:
            burst, name, proc = heapq.heappop(ready_queue)
            
            log.append({
                'time': time,
                'process': name,
                'ready_queue': [p[1] for p in ready_queue]
            })
            
            remaining_burst[name] -= 1
            time += 1

            if remaining_burst[name] > 0:
                heapq.heappush(ready_queue, (remaining_burst[name], name, proc))
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log

def priority_non_preemptive(processes, order):
    processes.sort(key=lambda x: x['arrival'])
    time = 0
    log = []
    ready_queue = []
    process_queue = processes[:]
    
    is_low_high = order == 'lowIsHigh'

    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            ready_queue.append(process_queue.pop(0))

        if ready_queue:
            ready_queue.sort(key=lambda p: p['priority'], reverse=not is_low_high)
            current_process_obj = ready_queue.pop(0)
            current_process = current_process_obj['name']
            
            burst_time = current_process_obj['burst']
            for i in range(burst_time):
                log.append({
                    'time': time,
                    'process': current_process,
                    'ready_queue': [p['name'] for p in ready_queue]
                })
                time += 1
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log
    
def priority_preemptive(processes, order):
    time = 0
    log = []
    ready_queue = []
    remaining_burst = {p['name']: p['burst'] for p in processes}
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    is_low_high = order == 'lowIsHigh'

    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            p = process_queue.pop(0)
            priority = p['priority'] if is_low_high else -p['priority']
            heapq.heappush(ready_queue, (priority, p['name'], p))

        if ready_queue:
            priority, name, proc = heapq.heappop(ready_queue)
            
            log.append({
                'time': time,
                'process': name,
                'ready_queue': [p[1] for p in ready_queue]
            })
            
            remaining_burst[name] -= 1
            time += 1

            if remaining_burst[name] > 0:
                heapq.heappush(ready_queue, (priority, name, proc))
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log

def round_robin(processes, quantum):
    time = 0
    log = []
    ready_queue = []
    remaining_burst = {p['name']: p['burst'] for p in processes}
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    
    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            ready_queue.append(process_queue.pop(0))
        
        if ready_queue:
            current_process_obj = ready_queue.pop(0)
            current_process = current_process_obj['name']
            
            burst_time = remaining_burst[current_process]
            run_time = min(burst_time, quantum)

            for i in range(run_time):
                log.append({
                    'time': time,
                    'process': current_process,
                    'ready_queue': [p['name'] for p in ready_queue]
                })
                time += 1
                remaining_burst[current_process] -= 1
                
                # Check for new arrivals during execution
                while process_queue and process_queue[0]['arrival'] <= time:
                    ready_queue.append(process_queue.pop(0))

            if remaining_burst[current_process] > 0:
                ready_queue.append(current_process_obj)
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log

def calculate_metrics(processes, log):
    completion_times = {}
    last_event_time = 0
    if log:
        last_event_time = log[-1]['time'] + 1

    for p in processes:
        last_seen_time = -1
        for i in range(len(log) - 1, -1, -1):
            if log[i]['process'] == p['name']:
                last_seen_time = log[i]['time'] + 1
                break
        completion_times[p['name']] = last_seen_time if last_seen_time != -1 else 0

    total_waiting_time = 0
    total_turnaround_time = 0
    details = []

    for p in processes:
        ct = completion_times[p['name']]
        tat = ct - p['arrival']
        wt = tat - p['burst']
        
        total_waiting_time += wt
        total_turnaround_time += tat
        
        details.append({
            'name': p['name'], 'arrival': p['arrival'], 'burst': p['burst'],
            'priority': p['priority'], 'ct': ct, 'tat': tat, 'wt': wt
        })

    n = len(processes)
    return {
        'avg_waiting_time': round(total_waiting_time / n, 2) if n > 0 else 0,
        'avg_turnaround_time': round(total_turnaround_time / n, 2) if n > 0 else 0,
        'details': details
    }


# --- API ENDPOINTS ---
@app.route('/api/schedule', methods=['POST'])
def schedule():
    data = request.json
    processes = data['processes']
    algorithm = data['algorithm']
    time_quantum = data.get('timeQuantum', 4)
    priority_order = data.get('priorityOrder', 'lowIsHigh')
    
    log = []
    if algorithm == 'fcfs':
        log = fcfs(processes)
    elif algorithm == 'sjf_non_preemptive':
        log = sjf_non_preemptive(processes)
    elif algorithm == 'sjf_preemptive':
        log = sjf_preemptive(processes)
    elif algorithm == 'priority_non_preemptive':
        log = priority_non_preemptive(processes, priority_order)
    elif algorithm == 'priority_preemptive':
        log = priority_preemptive(processes, priority_order)
    elif algorithm == 'roundrobin':
        log = round_robin(processes, time_quantum)
        
    metrics = calculate_metrics(processes, log)
    return jsonify({'log': log, 'metrics': metrics})

@app.route('/api/compare', methods=['POST'])
def compare():
    data = request.json
    processes = data['processes']
    time_quantum = data.get('timeQuantum', 4)
    priority_order = data.get('priorityOrder', 'lowIsHigh')
    
    results = {}
    
    # FCFS
    fcfs_log = fcfs(processes)
    results['FCFS'] = {'log': fcfs_log, 'metrics': calculate_metrics(processes, fcfs_log)}
    
    # SJF Non-Preemptive
    sjf_np_log = sjf_non_preemptive(processes)
    results['SJF (Non-P)'] = {'log': sjf_np_log, 'metrics': calculate_metrics(processes, sjf_np_log)}

    # SJF Preemptive
    sjf_p_log = sjf_preemptive(processes)
    results['SJF (Preemptive)'] = {'log': sjf_p_log, 'metrics': calculate_metrics(processes, sjf_p_log)}

    # Priority Non-Preemptive
    p_np_log = priority_non_preemptive(processes, priority_order)
    results['Priority (Non-P)'] = {'log': p_np_log, 'metrics': calculate_metrics(processes, p_np_log)}

    # Priority Preemptive
    p_p_log = priority_preemptive(processes, priority_order)
    results['Priority (Preemptive)'] = {'log': p_p_log, 'metrics': calculate_metrics(processes, p_p_log)}

    # Round Robin
    rr_log = round_robin(processes, time_quantum)
    results['Round Robin'] = {'log': rr_log, 'metrics': calculate_metrics(processes, rr_log)}

    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)

