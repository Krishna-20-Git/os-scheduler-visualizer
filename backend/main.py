from flask import Flask, request, jsonify
from flask_cors import CORS
import heapq
import copy

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- SCHEDULING ALGORITHMS (REWRITTEN FOR ROBUSTNESS) ---

def fcfs(processes_data):
    processes = copy.deepcopy(processes_data)
    time = 0
    log = []
    ready_queue = []
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    
    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            ready_queue.append(process_queue.pop(0))

        if ready_queue:
            current_process_obj = ready_queue.pop(0)
            burst_time = current_process_obj['burst']
            for _ in range(burst_time):
                log.append({
                    'time': time,
                    'process': current_process_obj['name'],
                    'ready_queue': [p['name'] for p in ready_queue]
                })
                time += 1
                # Check for new arrivals mid-burst
                while process_queue and process_queue[0]['arrival'] <= time:
                    ready_queue.append(process_queue.pop(0))
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log

def sjf_non_preemptive(processes_data):
    processes = copy.deepcopy(processes_data)
    time = 0
    log = []
    ready_queue = []
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    
    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            ready_queue.append(process_queue.pop(0))

        if ready_queue:
            ready_queue.sort(key=lambda p: p['burst'])
            current_process_obj = ready_queue.pop(0)
            burst_time = current_process_obj['burst']
            for _ in range(burst_time):
                log.append({
                    'time': time,
                    'process': current_process_obj['name'],
                    'ready_queue': [p['name'] for p in ready_queue]
                })
                time += 1
                while process_queue and process_queue[0]['arrival'] <= time:
                    ready_queue.append(process_queue.pop(0))
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log

def sjf_preemptive(processes_data):
    processes = copy.deepcopy(processes_data)
    time = 0
    log = []
    ready_queue = [] # Min-heap: (burst, name, process_obj)
    remaining_burst = {p['name']: p['burst'] for p in processes}
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    
    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            proc = process_queue.pop(0)
            heapq.heappush(ready_queue, (proc['burst'], proc['name'], proc))

        if ready_queue:
            burst, name, proc = heapq.heappop(ready_queue)
            
            log.append({
                'time': time,
                'process': name,
                'ready_queue': sorted([p[1] for p in ready_queue])
            })
            
            remaining_burst[name] -= 1
            time += 1

            if remaining_burst[name] > 0:
                heapq.heappush(ready_queue, (remaining_burst[name], name, proc))
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log

def priority_non_preemptive(processes_data, order):
    processes = copy.deepcopy(processes_data)
    time = 0
    log = []
    ready_queue = []
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    is_low_high = order == 'lowIsHigh'

    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            ready_queue.append(process_queue.pop(0))

        if ready_queue:
            ready_queue.sort(key=lambda p: p['priority'], reverse=not is_low_high)
            current_process_obj = ready_queue.pop(0)
            burst_time = current_process_obj['burst']
            for _ in range(burst_time):
                log.append({
                    'time': time,
                    'process': current_process_obj['name'],
                    'ready_queue': [p['name'] for p in ready_queue]
                })
                time += 1
                while process_queue and process_queue[0]['arrival'] <= time:
                    ready_queue.append(process_queue.pop(0))
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log
    
def priority_preemptive(processes_data, order):
    processes = copy.deepcopy(processes_data)
    time = 0
    log = []
    ready_queue = [] # Min-heap: (priority, arrival_tie_breaker, name, process_obj)
    remaining_burst = {p['name']: p['burst'] for p in processes}
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    is_low_high = order == 'lowIsHigh'

    while process_queue or ready_queue:
        while process_queue and process_queue[0]['arrival'] <= time:
            p = process_queue.pop(0)
            priority_val = p['priority'] if is_low_high else -p['priority']
            heapq.heappush(ready_queue, (priority_val, p['arrival'], p['name'], p)) # Add arrival time to break ties

        if ready_queue:
            priority, arrival_tie_breaker, name, proc = heapq.heappop(ready_queue)
            
            log.append({
                'time': time,
                'process': name,
                'ready_queue': sorted([p[2] for p in ready_queue])
            })
            
            remaining_burst[name] -= 1
            time += 1

            if remaining_burst[name] > 0:
                heapq.heappush(ready_queue, (priority, arrival_tie_breaker, name, proc))
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log

def round_robin(processes_data, quantum):
    processes = copy.deepcopy(processes_data)
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
            run_time = min(remaining_burst[current_process_obj['name']], quantum)

            for _ in range(run_time):
                log.append({
                    'time': time,
                    'process': current_process_obj['name'],
                    'ready_queue': [p['name'] for p in ready_queue]
                })
                time += 1
                remaining_burst[current_process_obj['name']] -= 1
                
                while process_queue and process_queue[0]['arrival'] <= time:
                    ready_queue.append(process_queue.pop(0))

            if remaining_burst[current_process_obj['name']] > 0:
                ready_queue.append(current_process_obj)
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            time += 1
    return log

def calculate_metrics(processes, log):
    completion_times = {}
    if not log:
        return {'avg_waiting_time': 0, 'avg_turnaround_time': 0, 'details': []}

    for p in processes:
        last_seen_time = -1
        for i in range(len(log) - 1, -1, -1):
            if log[i]['process'] == p['name']:
                last_seen_time = log[i]['time'] + 1
                break
        completion_times[p['name']] = last_seen_time if last_seen_time != -1 else p['arrival']

    total_waiting_time = 0
    total_turnaround_time = 0
    details = []

    for p in processes:
        ct = completion_times[p['name']]
        tat = max(0, ct - p['arrival'])
        wt = max(0, tat - p['burst'])
        
        total_waiting_time += wt
        total_turnaround_time += tat
        
        details.append({
            'name': p['name'], 'arrival': p['arrival'], 'burst': p['burst'],
            'priority': p.get('priority', 0), 'ct': ct, 'tat': tat, 'wt': wt
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
    processes = data.get('processes', [])
    if not processes: return jsonify({'log': [], 'metrics': calculate_metrics([], [])})
    
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
    processes = data.get('processes', [])
    if not processes: return jsonify({})

    time_quantum = data.get('timeQuantum', 4)
    priority_order = data.get('priorityOrder', 'lowIsHigh')
    
    results = {}
    
    algorithms_to_run = {
        'FCFS': (fcfs, []),
        'SJF (Non-P)': (sjf_non_preemptive, []),
        'SJF (Preemptive)': (sjf_preemptive, []),
        'Priority (Non-P)': (priority_non_preemptive, [priority_order]),
        'Priority (Preemptive)': (priority_preemptive, [priority_order]),
        'Round Robin': (round_robin, [time_quantum])
    }

    for name, (func, args) in algorithms_to_run.items():
        log = func(processes, *args)
        results[name] = {'log': log, 'metrics': calculate_metrics(processes, log)}

    return jsonify(results)

# New keep-alive endpoint
@app.route('/api/ping')
def ping():
    return jsonify({"status": "awake"})

if __name__ == '__main__':
    app.run(debug=True)

